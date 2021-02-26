import React from "react";
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
export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(null);
  const [captchaValue, setCaptchaValue] = React.useState(null);
  const [stripeId, setStripeIdValue] = React.useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };
  //console.log(props, "propss");
  const handleClose = () => {
    setAmount(null);
    setCaptchaValue(null);
    setOpen(false);
    props.handleClose();
  };
  const callback = (value) => {
    setCaptchaValue(value);
  };

  const handelCardDelete = async (cardId) => {
    const confirm = window.confirm(
      "Are you sure, you want to remove this card?"
    );
    if (confirm) {
      const response = await Axios.delete(`/payment/card/${cardId}`);
      if (response.data.success == true) {
        window.alert("Deleted");
        window.location.reload();
      } else {
        window.alert("Something went wrong.");
      }
    }
  };
  // specifying verify callback
  const updatePayment = () => {
    setOpen(true);
    if (stripeId != null) {
      props.updatePayment(amount, stripeId);
    } else {
      window.alert("Please select any card.");
    }
  };
  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Your balance is low! Please recharge to continue.
        </DialogTitle>
        <DialogContent>
          <div>
            {props.savedCards &&
              props.savedCards.map((card) => (
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
                  sitekey="6Lc6LMgZAAAAADLubDJkLQMTfnmLKbhcZjzJfdGa"
                  onChange={callback}
                />
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button
            onClick={updatePayment}
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
