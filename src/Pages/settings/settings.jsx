import React, { Component } from "react";
import "./settingsmin.css";
import PaymentAlert from "../../Components/paymentAlert/PaymentAlert";
import { Link } from "react-router-dom";
import Axios from "../../services/Axios";

class settings extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      open: false,
      client_id: "",
      savedCards: [],
    };
  }

  logoutHandler = () => {
    localStorage.removeItem("token");
    window.open("/login", "_self");
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  editinfo = async (e) => {
    e.preventDefault();
    const { username, email } = e.target;
    if (username === "" || email === "") {
      return alert("Please fill all fields");
    }
    alert("Press ok to confirm profile details change");
    Axios.post("/clientdetails", {
      name: this.state.username,
      email: this.state.email,
    })
      .then((res) => {
        if (res.data.errors) {
          return alert(res.data.errors);
        }
        console.log(res);
        alert("Success,changes saved");
      })
      .catch((err) => {
        window.open("/setting", "_self");
        if (err.response.data.err) {
          return alert(err.response.data.err);
        }
        alert("Something went wrong.");
        console.log(err);
      });
  };

  componentDidMount(prevProps) {
    Axios.get("/clientdetails")
      .then(({ data }) => {
        this.setState({
          username: data.firstName,
          client_id: data._id,
          email: data.email,
          savedCards: data.savedCards,
        });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  updatePayment = async (amount, stripeId) => {
    let body = {
      customer_id: this.state.client_id,
      amount: amount,
      stripeId: stripeId,
    };
    this.setState({ open: false });
    await Axios.post("/payment/payment", body)
      .then(({ data }) => {
        console.log(data, "update mpadfjafjk");
        if (data.success) {
          alert(data.msg);
          window.open("/basic", "_self");
        } else {
          alert("Credit Card is Not added");
          window.open("/addpayment", "_self");
        }
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  render() {
    const { username, email } = this.state;

    return (
      <div className="settingsIt2">
        <PaymentAlert
          open={this.state.open}
          handleClose={this.handleClose}
          updatePayment={this.updatePayment}
          savedCards={this.state.savedCards}
        />
        <div className="row" id="profilephoto2">
            <form onSubmit={this.editinfo} className="modal-body">
                <i className="fa fa-user col-2 mt-2" aria-hidden="true"></i>
                <input
                  type="text"
                  className="form-control border-0 rounded-1-right mb-1 w-20 align-middle pl-1 bg-white"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-lg"
                  placeholder="Username"
                  required
                  name="username"
                  onChange={this.handleChange}
                  value={username}
                ></input>
                <i className="fa fa-envelope col-2" aria-hidden="true"></i>
                <input
                  type="text"
                  className="form-control border-0 rounded-1-left mb-2 align-middle pl-1 bg-white"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-lg"
                  placeholder="email"
                  required
                  name="email"
                  onChange={this.handleChange}
                  value={email}
                ></input>
                  <button type="submit" className="btn btn-primary">
                    <i className="fa fa-pencil d-inline mr-1">Edit</i>
                  </button>
            </form>
        </div>

        <a href="/transactions" className="row" id="settingsBackground2">
          <div className="col-3">
            <i className="fa fa-user-circle fa-2x" id=""></i>
          </div>
          <div className="col-6">
            <h6 className="paddingfornames">Payment Details</h6>
          </div>
          <div className="col-3">
            <i
              className="fa fa-arrow-circle-right fa-2x t backgroundarrow"
              aria-hidden="true"
            ></i>
          </div>
        </a>

        <Link to="/addpayment" className="row" id="settingsBackground2">
          <div className="col-3">
            <i
              className="fa fa-credit-card fa-2x "
              id=""
            ></i>
          </div>
          <div className="col-6">
            <h6 className="paddingfornames">Add Credit Card</h6>
          </div>
          <div className="col-3">
            <i className="fa fa-arrow-circle-right fa-2x" aria-hidden="true"></i>
          </div>
        </Link>
        <Link to="/addpayment" className="row" id="settingsBackground2">
          <div className="col-3">
            <i
              className="fa fa-money fa-2x "
            ></i>
          </div>
          <div className="col-6">
            <h6 className="paddingfornames">Add Payment</h6>
          </div>
          <div className="col-3">
            <i className="fa fa-arrow-circle-right fa-2x" aria-hidden="true"></i>
          </div>
        </Link>
        <Link to="/resetpassword" className="row" id="settingsBackground2">
          <div className="col-3">
            <i className="fa fa-lock fa-2x " id=""></i>
          </div>
          <div className="col-6 p-0">
            <h6 className="paddingfornames">Change Password</h6>
          </div>
          <div className="col-3">
            <i className="fa fa-arrow-circle-right fa-2x" aria-hidden="true"></i>
          </div>
        </Link>
        <Link to="/passwords" className="row" id="settingsBackground2">
          <div className="col-3">
            <i
              className="fa fa-envelope-o  fa-2x "
              id=""
              aria-hidden="true"
            ></i>
          </div>
          <div className="col-6">
            <h6 className="paddingfornames">Logins</h6>
          </div>
          <div className="col-3">
            <i className="fa fa-arrow-circle-right fa-2x" aria-hidden="true"></i>
          </div>
        </Link>

        <Link to="/config" className="row" id="settingsBackground2">
          <div className="col-3">
            <i
              className="fa fa-cogs  fa-2x "
              id=""
              aria-hidden="true"
            ></i>
          </div>
          <div className="col-6">
            <h6 className="paddingfornames">Config</h6>
          </div>
          <div className="col-3">
            <i className="fa fa-arrow-circle-right fa-2x" aria-hidden="true"></i>
          </div>
        </Link>
        <Link to="/accounts/ebayAccounts" className="row" id="settingsBackground2">
          <div className="col-3">
            <i
              className="fa fa-at  fa-2x "
              id=""
              aria-hidden="true"
            ></i>
          </div>
          <div className="col-6">
            <h6 className="paddingfornames">Accounts</h6>
          </div>
          <div className="col-3">
            <i className="fa fa-arrow-circle-right fa-2x" aria-hidden="true"></i>
          </div>
        </Link>

        <Link to="/listingsettings" className="row" id="settingsBackground2">
          <div className="col-3">
            <i
              className="fa fa-list  fa-2x "
              id=""
              aria-hidden="true"
            ></i>
          </div>
          <div className="col-6">
            <h6 className="paddingfornames">Listing Settings</h6>
          </div>
          <div className="col-3">
            <i className="fa fa-arrow-circle-right fa-2x" aria-hidden="true"></i>
          </div>
        </Link>

        {/* <Link to="/charts" className="row" id="settingsBackground2">
          <div className="col-3">
            <i
              className="fa fa-line-chart  fa-3x colorIt"
              id="backgroundIt"
              aria-hidden="true"
            ></i>
          </div>
          <div className="col-6">
            <h4 className="paddingfornames">Analytics</h4>
          </div>
          <div className="col-3">
            <i className="fa fa-arrow-circle-right fa-3x" aria-hidden="true"></i>
          </div>
        </Link> */}

        <button
          className="row"
          id="settingsBackground2"
          onClick={this.logoutHandler}
        >
          <div className="col-12">
            <h6 className="paddingfornames ">LOGOUT</h6>
          </div>
        </button>
      </div>
    );
  }
}
export default settings;
