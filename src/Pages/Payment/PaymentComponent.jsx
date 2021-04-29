import React, { Component } from "react";
import { loadStripe } from "@stripe/stripe-js";
import AddPayment from "./AddPayment";
import {
  //CardElement,
  Elements,
  ElementsConsumer,
} from "@stripe/react-stripe-js";

// use the following key according to need
// dev- pk_test_lC5HYE8HU7h3YulsALN8XO0Y00QcNkc02w
// live- pk_live_eHRa9qUfyNNMG2lgJVYOj9Js00hCyttVfu

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE);
class PaymentComponent extends Component {
  //constructor(props) {
  //  super(props);
  //}
  render() {
    return (
      <Elements stripe={stripePromise}>
        <InjectedCheckoutForm {...this.props} />
      </Elements>
    );
  }
}

const InjectedCheckoutForm = (props) => (
  <ElementsConsumer>
    {({ stripe, elements }) => (
      <AddPayment {...props} stripe={stripe} elements={elements} />
    )}
  </ElementsConsumer>
);

export default PaymentComponent;
