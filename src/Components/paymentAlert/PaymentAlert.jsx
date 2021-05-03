import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Input from "@material-ui/core/Input";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ReCAPTCHA from "react-google-recaptcha";
import { BsFillTrashFill } from "react-icons/bs";
import Axios from "../../services/Axios";

export default function AlertDialog({ open, handleClose }) {
  const [amount, setAmount] = useState(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [stripeId, setStripeIdValue] = useState(null);
  const [savedCards, setSavedCards] = useState([]);

  useEffect(() => {
    getSavedCards();
  }, []);

  const handleModalClose = () => {
    setAmount(null);
    setCaptchaValue(null);
    handleClose();
  };

  const callback = (value) => {
    setCaptchaValue(value);
  };

  const getSavedCards = async () => {
    try {
      let response = await Axios.get("/subscription/details");
      setSavedCards(response.data.User.savedCards);
    } catch (err) {
      alert("Error in fetching card details...");
    }
  };

  const updatePayment = async (amount, stripeId) => {
    let body = {
      amount: amount,
      stripeId: stripeId,
    };

    await Axios.post("/payment/payment", body)
      .then(({ data }) => {
        if (data.success) {
          alert(data.msg);
          window.location.reload();
        } else {
          alert("Credit Card is Not added");
          window.open("/subscription", "_self");
        }
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  const handelCardDelete = async (cardId) => {
    const confirm = window.confirm(
      "Are you sure, you want to remove this card?"
    );
    if (confirm) {
      const response = await Axios.delete(`/payment/card/${cardId}`);
      if (response.data.success == true) {
        window.alert("Deleted");
        getSavedCards();
      } else {
        window.alert("Something went wrong.");
      }
    }
  };
  // specifying verify callback
  const handleUpdatePayment = () => {
    if (stripeId != null) {
      updatePayment(amount, stripeId);
    } else {
      window.alert("Please select any card.");
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Your balance is low! Please recharge to continue.
        </DialogTitle>
        <DialogContent>
          <div>
            {savedCards &&
              savedCards.map((card) => (
                <div className="row">
                  <div className="col-2">
                    <input
                      type="radio"
                      name="stripeCard"
                      value={card.stripe_customer_id}
                      onChange={(e) => {
                        setStripeIdValue(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-8">
                    <p>
                      {card.card_brand} **** **** **** {card.last_four_digit}{" "}
                      {card.exp_month}/{card.exp_year[2]}
                      {card.exp_year[3]}
                    </p>
                  </div>
                  <div
                    className="col-2"
                    onClick={() => handelCardDelete(card._id)}
                  >
                    <BsFillTrashFill />
                  </div>
                </div>
              ))}
          </div>
          <DialogContentText id="alert-dialog-description">
            Please choose an amount to continue:
            <div className="row mt-2">
              <div className="col">
                <Button
                  variant="outlined"
                  color={amount == 100 ? "secondary" : "primary"}
                  onClick={() => setAmount(100)}
                >
                  $ 100.00
                </Button>
              </div>
              <div className="col">
                <Button
                  variant="outlined"
                  color={amount == 500 ? "secondary" : "primary"}
                  onClick={() => setAmount(500)}
                >
                  $ 500.00
                </Button>
              </div>
              <div className="col">
                <Input
                  variant="outlined"
                  onChange={(event) => setAmount(event.target.value)}
                  type="number"
                  placeholder="Enter Amount"
                ></Input>
              </div>
            </div>
            {amount != null && (
              <div className="row d-flex justify-content-center">
                {" "}
                <ReCAPTCHA
                  sitekey="6LeB67kaAAAAAD6pFtXtvzLRqE6VXuyT6uCfIzAq"
                  {/*sitekey="6Lc6LMgZAAAAADLubDJkLQMTfnmLKbhcZjzJfdGa"*/}
                  onChange={callback}
                />
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Close
          </Button>
          <Button
            onClick={handleUpdatePayment}
            color="primary"
            disabled={captchaValue == null ? true : false}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
