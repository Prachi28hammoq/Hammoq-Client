import { withWidth } from "@material-ui/core";
import React,{ useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Axios from "../../../services/Axios";
export default function CancelSubscriptionModal(props) {
  const {
    cancelSubscriptionModalDetails: { subscriptionId },
    getSubscriptionDetails,
    onHide,
    setMessage
  } = props;
  const [color, setradiovalue] = useState(null);

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
        {/* <div className="d-flex justify-content-around">
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
       */}
             <div class="container">
               
                  <div className="row">
                  <div className="col-12">
                  <h6>If you proceed, you will lose all of your listings on Hammoq..</h6>
                  <p>Can you please help us understand why you are canceling so that we may do better in the future?</p>
                  </div>
                  <div className="col-8">
                    <label><input type="radio" name="feedback" value="1" onChange={(e) => {setradiovalue(e.target.value);}}/> Quality of listings are too low</label><br></br>
                    <label><input type="radio" name="feedback" value="2" onChange={(e) => {setradiovalue(e.target.value);}}/> Service price is too high</label><br></br>
                    <label><input type="radio" name="feedback" value="3" onChange={(e) => {setradiovalue(e.target.value);}}/> Stopped reselling</label><br></br>
                    <label><input type="radio" name="feedback" value="4" onChange={(e) => {setradiovalue(e.target.value);}}/> Don't need listing and crosslisting services</label><br></br>
                    <label><input type="radio" name="feedback" value="5" onChange={(e) => {setradiovalue(e.target.value);}}/> Found another solution that works better for me</label><br></br>
                    <label><input type="radio" name="feedback" value="6" onChange={(e) => {setradiovalue(e.target.value);}}/> Doesn't have the features I want</label><br></br>
                  
                  </div>
                </div> 
                <div className="row">
                <div className="col-12">
                <textarea type="text" name="suggestions" placeholder="  Write some suggestions...." style={{width:"80%",height:50}}/>
                </div>
                </div>
                <h6>Are you sure you wish to continue?</h6>
                <div className="row">
                <div className="col-2"></div>
                <div className="col-4">
                <button className=" btn btn-outline-success"onClick={onHide}> No, Do Not Cancel My Active Subscription.</button> 
                </div>
                <div className="col-4">
                <button className=" btn btn-outline-danger" onClick={handleCancelAtPeriodEndClick}> Yes, Please Cancel My Active Subscription.</button>
                </div>
                <div className="col-2"></div>
                </div>
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
