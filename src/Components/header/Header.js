import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./headermin.css";
import Logo from "../images/hammock.svg";
import Axios from "../../services/Axios";
import { ClientMessagesContext } from '../../ContextProviders/ClientMessagesProvider';

let refreshTokenInterval;

const Header = (props) => {

  const { contextUnreadMessagesCount, setContextClientId } = useContext(ClientMessagesContext);

  const [rates, setRates] = useState({});
  const [bal, setBal] = useState(0);
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [clientMessageSeenCount, setClientMessageSeenCount] = useState(0);

  useEffect(() => {

    const mountComponent = async () => {

      if (localStorage.getItem("token")) {

        refreshUserTokenForAllEbayAccounts();
        refreshTokenInterval = setInterval(() => refreshUserTokenForAllEbayAccounts(), 7100000);

        await Axios.get("/clientdetails/headerinfo")
                   .then(({ data }) => {
                      if (parseInt(data.balance) < 5) setOpen(true);
                          setBal(data.balance);
                          setClientId(data._id);
                          setContextClientId(data._id);
                          setCustomerName(data.firstName);
                          setClientMessageSeenCount(data.clientMessageSeenCount);
                          localStorage.setItem("cid", data._id);
                          localStorage.setItem("customerName", data.firstName);
                          localStorage.setItem("isSubscribed", data.isSubscribed);
                    })
                    .catch((err) => console.log(err));

      await Axios.get("/tokenversion")
                 .then(({ data }) => {if(!data.valid) logoutHandler()})
                 .catch((err) => {if(err.response.data.message === 'Invalid Token.') this.logout();});
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
    await Axios.post('/ebayAuth/refreshtokens/');
  }

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isSubscribed");
    localStorage.removeItem("customerName");
    localStorage.removeItem("cid");
    window.open("/login", "_self");
  };

  return(
    <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#007bff" }}
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
          <ul className="navbar-nav ml-auto">
            {/* <li className="nav-item dropdown">
              <li className="nav-item">
                <a
                  href="/basic"
                  className="nav-link"
                  style={{ color: "white" }}
                >
                  Listing
                </a>
              </li>
            </li> */}

            <li className="nav-item">
              <Link to="/basic" className="nav-link" style={{ color: "white" }}>
                Basic Listing
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/messages"
                className="nav-link"
                style={{ color: "white" }}
              >
                Messages({clientMessageSeenCount})
              </Link>
            </li>

{/*<li className="nav-item">
              <a
                href="/templates"
                className="nav-link"
                style={{ color: "white" }}
              >
                Templates
              </a>
            </li>*/}
            {/* <li className="nav-item">
              <a
                href="/accounts"
                className="nav-link"
                style={{ color: "white" }}
              >
                Accounts
              </a>
            </li> */}
            <li className="nav-item">
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
            <li className="nav-item">
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
