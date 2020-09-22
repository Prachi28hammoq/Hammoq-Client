import React, { Component } from "react";
import { loadStripe } from "@stripe/stripe-js";
import AddPayment from "./AddPayment";
import {
  CardElement,
  Elements,
  ElementsConsumer,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_live_eHRa9qUfyNNMG2lgJVYOj9Js00hCyttVfu");
class PaymentComponent extends Component {
  constructor(props) {
    super(props);
  }
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
