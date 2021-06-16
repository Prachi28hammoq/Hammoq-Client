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
        variant: "success",
        show: true,
        msg: "The request to cancel your subscription has been made successfully.",
      });
    } 
    catch (err) 
    {
      setMessage({
        varient: "danger",
        show: true,
        msg:
          "There is a error when cancelling the subscription, please try again after 2 minutes or please contact customer support.",
      });
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
          Cancel Active Subscription
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-around">
          <button
            className=" btn btn-outline-success"
            onClick={onHide}
          >
            No, Do Not Cancel My Active Subscription.
          </button>
          or
          <button
            className=" btn btn-outline-danger"
            onClick={handleCancelAtPeriodEndClick}
          >
            Yes, Please Cancel My Active Subscription.
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <small>
          <ul>
          
            <li>
              By clicking on <b>Yes, Cancel My Active Subscription</b>, your subscription will
              expire at the end of your current period and you will not be charged
              again.
            </li>
            <li>
              Once canceled, you will not be able to use any of our services, but you are still able to resubscribe later.
            </li>
          </ul>
        </small>
      </Modal.Footer>
    </Modal>
  );
}
