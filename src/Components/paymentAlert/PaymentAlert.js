import React from "react";
import Button from '@material-ui/core/Button'
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import ReCAPTCHA from "react-google-recaptcha"

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(null);
  const [captchaValue, setCaptchaValue] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setAmount(null);
    setCaptchaValue(null);
    setOpen(false);
    props.handleClose();
  };
  const callback = (value) => {
    console.log(value);
    setCaptchaValue(value);
  };

  // specifying verify callback
  const updatePayment = () => {
    setOpen(false);
    props.updatePayment(amount);
  };
  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Dialog //dialog box
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Your balance is low! Please recharge to continue.
        </DialogTitle>
        <DialogContent>
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
                  color={amount == 200 ? "secondary" : "primary"}
                  onClick={() => setAmount(200)}
                >
                  $ 200.00
                </Button>
              </div>
              <div className="col">
                <Button
                  variant="outlined"
                  color={amount == 500 ? "secondary" : "primary"}
                  onClick={() => setAmount(200)}
                >
                  $ 500.00
                </Button>
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
