import React from "react";
import Modal from "react-bootstrap/Modal";
import Axios from "../../../services/Axios";
export default function CancelSubscriptionModal(props) {
  const {
    cancelSubscriptionModalDetails: { subscriptionId },
    getSubscriptionDetails,
    onHide,
    setMessage,
  } = props;

  const handleCancelAtPeriodEndClick = async () => {
    try {
      const res = await Axios.post("/subscription/cancel", {
        subscriptionId,
      });
      onHide();
      getSubscriptionDetails();
      setMessage({
        varient: "success",
        show: true,
        msg:
          "Request to cancel your subscription at current period end has been made successfully.",
      });
    } catch (err) {
      alert(
        "There is error in cancelling the subscription, try again after sometime or contact admin.."
      );
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
        <Modal.Title id="contained-modal-title-vcenter">
          Cancel Subscription
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-around">
          <button
            className=" btn btn-outline-success"
            onClick={onHide}
          >
            No, Don't cancel my subscription.
          </button>
          or
          <button
            className=" btn btn-outline-danger"
            onClick={handleCancelAtPeriodEndClick}
          >
            Yes, Cancel my subscription
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <small>
          <ul>
          
            <li>
              By clicking on <b>Yes, Cancel my subscription</b>, your active plan will
              be cancled after your current period end and you won't be charged
              anymore for subscription.
            </li>
            <li>
              Once cancelled, you won't be able to use any of our services
              associated with the plan, But you can always resubscribe later.
            </li>
          </ul>
        </small>
      </Modal.Footer>
    </Modal>
  );
}
