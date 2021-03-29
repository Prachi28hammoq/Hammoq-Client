import React, { Component, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
//import {Helmet} from "react-helmet";
import "./headermin.css";
import Logo from "../images/hammock.svg";
import PaymentAlert from "../paymentAlert/PaymentAlert";
import Popover from "@material-ui/core/Popover";
import Axios, { assetsURL } from "../../services/Axios";
import { ClientMessagesContext } from '../../ContextProviders/ClientMessagesProvider';

Axios.defaults.headers["x-access-token"] = localStorage.getItem("token");

let refreshTokenInterval;

const Header = (props) => {

  const { contextUnreadMessagesCount, setContextClientId } = useContext(ClientMessagesContext);

  const [rates, setRates] = useState({});
  const [bal, setBal] = useState(0);
  const [basicCheck, setBasicCheck] = useState(true);
  const [advanceCheck, setAdvanceCheck] = useState(true);
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [clientMessageSeenCount, setClientMessageSeenCount] = useState(0);

  useEffect(() => {

    const mountComponent = async () => {

      if (localStorage.getItem("token")) {

        refreshUserTokenForAllEbayAccounts();
        refreshTokenInterval = setInterval(() => refreshUserTokenForAllEbayAccounts(), 7100000);

        await Axios.get("/payment/rates")
          .then((res) => {
            setRates(res.data[res.data.length - 1]);
          })
          .catch((err) => console.log(err) || alert(JSON.stringify(err)));

        await Axios.get("/clientdetails")
          .then(({ data }) => {
            if (parseInt(data.balance) < 5) setOpen(true);
            setBal(data.balance);
            setClientId(data._id);
            setContextClientId(data._id);
            setCustomerName(data.firstName);
            setClientMessageSeenCount(data.clientMessageSeenCount);
            localStorage.setItem("customerName", customerName);
          })
          .catch((err) => console.log(err) || alert(JSON.stringify(err)));

        if (bal >= 5.0) {
          localStorage.setItem("paymentadded", true);
        }
      }
    }

    mountComponent();

    setClientMessageSeenCount(contextUnreadMessagesCount);

    return () => {
      clearInterval(refreshTokenInterval);
    };

  }, []);

  useEffect(() => {
    setClientMessageSeenCount(contextUnreadMessagesCount);
  }, [contextUnreadMessagesCount])


  const refreshUserTokenForAllEbayAccounts = async () => {

    let res = await Axios.post('/ebayAuth/refreshtokens/');

  }

  const logoutHandler = () => {
    localStorage.removeItem("token");
    window.open("/login", "_self");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updatePayment = async (amount) => {
    let body = {
      customer_id: clientId,
      amount: amount,
    };
    setOpen(false);
    await Axios.post("/payment/payment", body)
      .then(({ data }) => {
        if (data.success) alert(data.msg);
        else alert("Error");
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  return(
    <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#4db0cc" }}
      >
        {/* <PaymentAlert
          open={this.state.open}
          handleClose={this.handleClose}
          updatePayment={this.updatePayment}
       />*/}

        <a href="/" className="navbar-brand">
          <img src={Logo} alt="hammock" height="40px" />
        </a>
        <h5 className="ml-4 mt-2">
          <i className="text-white">Balance: $ {bal ? bal.toFixed(2) : 0}</i>
        </h5>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto">
            {/* <li class="nav-item dropdown">
              <li class="nav-item">
                <a
                  href="/basic"
                  className="nav-link"
                  style={{ color: "white" }}
                >
                  Listing
                </a>
              </li>
            </li> */}

            <li class="nav-item">
              <Link to="/basic" className="nav-link" style={{ color: "white" }}>
                Basic Listing
              </Link>
            </li>
            <li class="nav-item">
              <Link
                to="/messages"
                className="nav-link"
                style={{ color: "white" }}
              >
                Messages({clientMessageSeenCount})
              </Link>
            </li>

            <li class="nav-item">
              <a
                href="/templates"
                className="nav-link"
                style={{ color: "white" }}
              >
                Templates
              </a>
            </li>
            <li class="nav-item">
              <a
                href="/accounts"
                className="nav-link"
                style={{ color: "white" }}
              >
                Accounts
              </a>
            </li>
            <li class="nav-item">
              <a
                href="/accounting"
                className="nav-link"
                style={{ color: "white" }}
              >
                Accounting
              </a>
            </li>
            <a href="/setting" className="nav-link" style={{ color: "white" }}>
              Setting
            </a>
            <li class="nav-item">
              <span
                onClick={logoutHandler}
                className="nav-link c-pointer text-danger"
              >
                <div className="fas fa-sign-out-alt mr-1"></div>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </nav>
  )

}

export default Header;