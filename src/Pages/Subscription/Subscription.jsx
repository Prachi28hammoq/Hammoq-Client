import React, { useEffect, useState } from "react";
import Axios from "../../services/Axios";
// import Card from "./Components/Card";
import SubscriptionModal from "./Components/SubscriptionModal";
import CancelSubscriptionModal from "./Components/CancelSubscriptionModal";
import SubscriptionDetails from "./Components/SubscriptionDetails";
import Alert from "react-bootstrap/Alert";
import TransactionCard from "./Components/TransactionCard";
import PaymentCard from "./Components/PaymentCard";
////////////////////////////////////////////////////////////////////////////////////
export default function Subscription() {
  const [message, setMessage] = useState({
    show: false,
    variant: "primary",
    msg: "",
  });
  const [subscriptionModalDetails, setSubscriptionModalDetails] = useState({
    msg: "",
    show: false,
  });
  const [
    cancelSubscriptionModalDetails,
    setCancelSubscriptionModalDetails,
  ] = useState({
    msg: "",
    show: false,
    subscriptionId: "",
  });

  const [clientDetails, setClientDetails] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  ////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // getPlans();
    getSubscriptionDetails();
    getClientDetails();
  }, []);
  ////////////////////////////////////////////////////////////////////////////////////

  const getClientDetails = async () => {
    try {
      let response = await Axios.get("/subscription/details");

      if (response.data) {
        setClientDetails(response.data.User);
        if (!response.data.User.isSubscribed)
        {
          setMessage({
            show: true,
            msg: "You are not subscribed to any subscription plan yet, please choose a subscription plan.",
            variant: "warning",
          });
        }
        else if(response.data.User.isSubscribed)
        {
          setSubscriptionStatus(true);
        }
      } else {
        setMessage({
          variant: "danger",
          show: true,
          msg: "Error in fetching client details!",
        });
      }
    } catch (err) {
      setMessage({
        variant: "danger",
        show: true,
        msg: "Error in fetching client details!",
      });
    }
  };
  const getSubscriptionDetails = async () => {
    try {
      const res = await Axios.get("/subscription"),
        subscriptions = res.data.subscriptions.data;

      subscriptions.map((subscription) => {
        subscription.created = new Date(
          subscription?.created * 1000
        ).toDateString();
        subscription.current_period_start = new Date(
          subscription?.current_period_start * 1000
        ).toDateString();
        subscription.current_period_end = new Date(
          subscription?.current_period_end * 1000
        ).toDateString();
      });

      setSubscriptions(subscriptions);
    } catch (err) {
      console.log(err);
      setMessage({
        variant: "danger",
        show: true,
        msg: "Unable to get subscription details!",
      });
    }
  };

  const handleCancelSubscription = (id) => {
    setCancelSubscriptionModalDetails({
      ...cancelSubscriptionModalDetails,
      show: true,
      subscriptionId: id,
    });
  };
  ////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {/* Error msg section  */}
      <Alert
        show={message.show}
        variant={message.variant}
        onClose={() => setMessage({ ...message, show: false })}
        dismissible
      >
        {message.msg}
      </Alert>

      {subscriptionStatus ? (<PaymentCard/>) : ("")}


      <SubscriptionDetails
        subscriptions={subscriptions}
        showSubscriptionModal={() =>
          setSubscriptionModalDetails({
            ...subscriptionModalDetails,
            show: true,
          })
        }
        handleCancelSubscription={handleCancelSubscription}
      />

      <TransactionCard />

      <SubscriptionModal
        show={subscriptionModalDetails.show}
        onHide={() =>
          setSubscriptionModalDetails({
            ...subscriptionModalDetails,
            show: false,
          })
        }
        subscriptionModalDetails={subscriptionModalDetails}
        getSubscriptionDetails={getSubscriptionDetails}
        setMessage={setMessage}
      />

      <CancelSubscriptionModal
        show={cancelSubscriptionModalDetails.show}
        cancelSubscriptionModalDetails={cancelSubscriptionModalDetails}
        onHide={() =>
          setCancelSubscriptionModalDetails({
            ...cancelSubscriptionModalDetails,
            show: false,
          })
        }
        setMessage={setMessage}
        getSubscriptionDetails={getSubscriptionDetails}
      ></CancelSubscriptionModal>
    </>
  );
}
