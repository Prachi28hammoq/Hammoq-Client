import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Axios from "../../../services/Axios";

export default function SubscriptionModal(props) {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE);
  return (
    <Elements stripe={stripePromise}>
      <PaymentModal props={props} />
    </Elements>
  );
}

const PaymentModal = ({ props }) => {
  const [loading, setLoading] = useState(false);
  const elements = useElements(),
    stripe = useStripe();

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const card = elements.getElement(CardElement),
        { onHide, getSubscriptionDetails, setMessage } = props,
        token = await stripe.createToken(card);
      if (token.error) {
        setLoading(false);
        alert(token.error.message);
      } else {
        const tokenId = token.token.id,
        response = await Axios.post("/subscription/", {tokenId});
        getSubscriptionDetails();
        setMessage({
          msg: "Subscribed Successfully!",
          show: true,
          variant: "success",
        });
        onHide();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      
    }
  };

  const { subscriptionModalDetails } = props;
  // const [selectedCard, setSelectedCard] = useState({});
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Get Subscribed To Hammoq's Services.
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <h4>Centered Modal</h4> */}
        <p>
          This is a subscription of $99 a month. $99 will be added to your
          current account balance for service costs. If the balance is not used, it will not be refunded or usable the next month.
          Any extra balance added other than the initial $99 will stay in your account and will be accessible the next month.
        </p>
        <hr />
        <CardElement />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <div>
          <small>
            <i>{subscriptionModalDetails.msg}</i>
          </small>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSubscription}
          disabled={loading}
        >
          {loading ? "Subscribing" : "Pay and Subscribe"}
        </button>{" "}
      </Modal.Footer>
    </Modal>
  );
};
