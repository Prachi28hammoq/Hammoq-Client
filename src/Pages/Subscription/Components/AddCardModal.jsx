import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Axios from "../../../services/Axios";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function AddCardModal(props) {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE);
  return (
    <Elements stripe={stripePromise}>
      <AddCard props={props} />
    </Elements>
  );
}

const AddCard = ({ props }) => {
  const elements = useElements(),
    stripe = useStripe(),
    { onHide } = props;
  const [loading, setLoading] = useState(false);

  const handleAddCard = async () => {
    try {
      setLoading(true);
      const card = elements.getElement(CardElement),
        token = await stripe.createToken(card);
      if (token.error) {
        alert(token.error.message);
        setLoading(false);
      }
      const res = await Axios.post("/payment/firstpayment", {
        // email: this.state.email,
        card_details: token,
        price: 1, //$1
      });
      alert("Card added successfully.");
      onHide();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Something went wrong");
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CardElement />
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-outline-success mt-2"
            onClick={handleAddCard}
            disabled={loading}
          >
            {loading ? "Loading..." : "Add Card"}
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <small>
          <ul>
            <li>
              You will be charged $1 for adding this card, that amount will be
              added to your balance.
            </li>
          </ul>
        </small>
      </Modal.Footer>
    </Modal>
  );
};
