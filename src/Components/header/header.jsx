import React, { Component } from "react";
import { Link } from "react-router-dom";
import message from "../../Pages/Messages/message";
//import {Helmet} from "react-helmet";
import "./headermin.css";
import Logo from "../images/hammock.svg";
import PaymentAlert from "../paymentAlert/PaymentAlert";
import Popover from "@material-ui/core/Popover";
import Axios, { assetsURL } from "../../services/Axios";
Axios.defaults.headers["x-access-token"] = localStorage.getItem("token");
let refreshTokenInterval=null
class header extends Component {
  constructor() {
    super();
    this.state = {
      rates: {},
      bal: 0,
      basiccheck: true,
      advancecheck: true,
      open: false,
      client_id: "",
      customerName: "",
      clientMessageSeenCount: 0,
    };
  }

  componentDidMount = async () => {
    if (localStorage.getItem("token")) {

      this.refreshUserTokenForAllEbayAccounts();
      refreshTokenInterval = setInterval(() => this.refreshUserTokenForAllEbayAccounts(), 7100000);

      await Axios.get("/payment/rates")
        .then((res) => {
          //rates = res.data[res.data.length - 1];
          this.setState({ rates: res.data[res.data.length - 1] });
        })
        .catch((err) => console.log(err) || alert(JSON.stringify(err)));

      await Axios.get("/clientdetails")
        .then(({ data }) => {
          if (parseInt(data.balance) < 5) this.setState({ open: true });
          this.setState({
            bal: data.balance,
            client_id: data._id,
            customerName: data.firstName,
            clientMessageSeenCount: data.clientMessageSeenCount,
          });
          localStorage.setItem("customerName", this.state.customerName);
        })
        .catch((err) => console.log(err) || alert(JSON.stringify(err)));

        if(this.state.bal >= 5.0)
        {
          localStorage.setItem("paymentadded", true);
        }
    }
  };

  componentWillUnmount = async () => {

    clearInterval(refreshTokenInterval);

  }

  refreshUserTokenForAllEbayAccounts = async () => {

    let res = await Axios.post('/ebayAuth/refreshtokens/');

  }

  logoutHandler = () => {
    localStorage.removeItem("token");
    window.open("/login", "_self");
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  updatePayment = async (amount) => {
    let body = {
      customer_id: this.state.client_id,
      amount: amount,
    };
    this.setState({ open: false });
    await Axios.post("/payment/payment", body)
      .then(({ data }) => {
        if (data.success) alert(data.msg);
        else alert("Error");
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  render() {
    const { basiccheck, advancecheck, rates, bal } = this.state;
    return (
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
          <ul className="navbar-nav ml-auto">
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

            <li className="nav-item">
              <Link to="/basic" className="nav-link" style={{ color: "white" }}>
                Basic Listing
              </Link>
            </li>            
            <li className="nav-item">
              <a
                href="/accounts"
                className="nav-link"
                style={{ color: "white" }}
              >
                Accounts
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/accounting"
                className="nav-link"
                style={{ color: "white" }}
              >
                Accounting
              </a>
            </li>
{/*<li className="nav-item">
              <Link
                to="/messages"
                className="nav-link"
                style={{ color: "white" }}
              >
                Messages({this.state.clientMessageSeenCount})
              </Link>
            </li>*/}

{/*            <li class="nav-item">
              <a
                href="/templates"
                className="nav-link"
                style={{ color: "white" }}
              >
                Templates
              </a>
            </li>*/}
            <a href="/setting" className="nav-link" style={{ color: "white" }}>
              Setting
            </a>
            <li className="nav-item">
              <span
                onClick={this.logoutHandler}
                className="nav-link c-pointer text-danger"
              >
                <div className="fas fa-sign-out-alt mr-1"></div>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
export default header;
