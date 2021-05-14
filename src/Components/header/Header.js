import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./headermin.css";
import Logo from "../images/hammock.svg";
import Axios from "../../services/Axios";
import { ClientMessagesContext } from '../../ContextProviders/ClientMessagesProvider';

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
      }
    }

    mountComponent();
    setClientMessageSeenCount(contextUnreadMessagesCount);

  }, []);

  useEffect(() => {
    setClientMessageSeenCount(contextUnreadMessagesCount);
  }, [contextUnreadMessagesCount])

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
            <li className="nav-item">
              <a href="/basic" className="nav-link" style={{'color':'black'}}>
                <i className="fas fa-hand-holding-usd mr-1"></i>
                Basic Listing
              </a>
            </li>
            <li className="nav-item">
              <a href="/messages" className="nav-link" style={{'color':'black'}}>
                <i className="fas fa-envelope mr-1"></i>
                Messages({clientMessageSeenCount})
              </a>
            </li>

            {/*<li className="nav-item">
              <a
                href="/templates"
                className="nav-link"
              >
                Templates
              </a>
            </li>*/}
            <li className="nav-item">
              <a href="/accounting" className="nav-link" style={{'color':'black'}}>
                <i className="fas fa-file-invoice-dollar mr-1"></i>
                Accounting
              </a>
            </li>
            <li className="nav-item">
              <a href="/setting" className="nav-link" style={{'color':'black'}}>
              <i className="fas fa-user-cog mr-1"></i>
                Setting
              </a>
            </li>
            <li className="nav-item">
              <span
                onClick={logoutHandler}
                style={{'color':'red'}}
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
