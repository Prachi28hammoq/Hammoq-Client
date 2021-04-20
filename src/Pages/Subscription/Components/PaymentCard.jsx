import React, { useState, useEffect } from "react";
import PaymentAlert from "../../../Components/paymentAlert/PaymentAlert";
import Axios from "../../../services/Axios";
import AddCardModal from "./AddCardModal";
export default function PaymentCard({ savedCards }) {
  const [amountModalOpen, setAmountModalOpen] = useState(false);
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);

  useEffect(() => {}, []);

  const closeModal = () => {
    setAmountModalOpen(false);
  };
  const updatePayment = async (amount, stripeId) => {
    let body = {
      amount: amount,
      stripeId: stripeId,
    };
    setAmountModalOpen(false);
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
  return (
    <div
      className="my-2 p-2 py-3"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.125)",
        borderRadius: "4px 4px 0 0",
        boxShadow:
          "0 3px 6px 0 rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <PaymentAlert
        open={amountModalOpen}
        handleClose={closeModal}
        updatePayment={updatePayment}
        savedCards={savedCards}
      />

      <AddCardModal
        show={addCardModalOpen}
        onHide={() => {
          setAddCardModalOpen(false);
        }}
      />

      <button
        className="btn btn-outline-info mx-1"
        onClick={() => setAmountModalOpen(true)}
      >
        Add Amount
      </button>
      <button
        className="btn btn-outline-info mx-1"
        onClick={() => setAddCardModalOpen(true)}
      >
        Add Card
      </button>
    </div>
  );
}
