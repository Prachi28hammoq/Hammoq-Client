import React, { Component } from "react";
import Axios from "../../services/Axios";
import "./signupmin.css";
import Logo from "../../Components/images/hammock.svg";
import { Link } from "react-router-dom";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      country: "",
      city: "",
      state: "",
      zip: "",
      email: "",
      phoneno: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      term1: false,
      term2: false,
      isSubmitting: false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleToggleCheckbox = (e) => {
    const { name } = e.target;
    this.setState({ [name]: !this.state[name] });
  };

  handleSubmit = (e) => {
    this.setState({ isSubmitting: true });
    e.preventDefault();
    const {
      term1,
      term2,
      address1,
      address2,
      password,
      confirmPassword,
      country,
      city,
      state,
      zip,
      firstName,
      lastName,
      email,
      phoneno,
      referralCode
    } = this.state;

    if (!term1) {
      this.setState({ isSubmitting: false });
      return alert("Accept all the terms.");
    }

    if (email == "") {
      this.setState({ isSubmitting: false });
      return alert("Email field is required.");
    }

    if (phoneno == "") {
      this.setState({ isSubmitting: false });
      return alert("Phone.no field is required.");
    }

    if (firstName == "" || lastName == "") {
      this.setState({ isSubmitting: false });
      return alert("Name field is required.");
    }

    if (password !== confirmPassword) {
      this.setState({ isSubmitting: false });
      return alert("Password don't match.");
    }

    const body = { ...this.state };
    Axios.post("/signup", body)
      .then((res) => {
        if (res.data.errors) {
          this.setState({ isSubmitting: false });
          return alert(res.data.errors);
        }
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("paymentadded", false);
        window.open("/addpayment", "_self");
      })
      .catch((err) => {
        this.setState({ isSubmitting: false });
        if (err) {
          return alert(err);
      }
        alert("Something went wrong. Can't SignUp");
      });
  };

  render() {
    const {
      firstName,
      lastName,
      address1,
      address2,
      country,
      state,
      zip,
      email,
      phoneno,
      city,
      password,
      confirmPassword,
      isSubmitting,
      referralCode
    } = this.state;
    return (
      <div className="row col-lg-5 m-auto">
        <form className="formIt mt-7">
          <div className="d-flex align-items-center justify-content-between mb-5 ml-5 mr-5">
            <img src={Logo} alt="hammoq" className="img" />
          </div>
          <Link to="/products/submitted">
            <i className="fa fa-arrow-left mt-3" aria-hidden="true"></i>
          </Link>
          <div>
            <Link to="/signin">Login</Link>
          </div>
          <br />
          <h5>All fields are required</h5>
          <br />
          <label htmlFor="firstname">FIRST NAME:</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={this.handleChange}
            className="form-control mb-4"
            required
          ></input>
          <label htmlFor="lastname">LAST NAME:</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={this.handleChange}
            className="form-control mb-4"
            required
          ></input>
          <label htmlFor="email">EMAIL:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleChange}
            className="form-control mb-4"
            required
          ></input>
          <label htmlFor="state">PHONE.NO:</label>
          <input
            type="text"
            name="phoneno"
            value={phoneno}
            onChange={this.handleChange}
            className="form-control  mb-4"
            required
          ></input>
          <label htmlFor="password">PASSWORD:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            className="form-control mb-4"
            required
          ></input>
          <label htmlFor="passwordconfirmation">PASSWORD CONFIRMATION:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={this.handleChange}
            className="form-control mb-4"
            required
          ></input>
          <label htmlFor="referralCode">REFERRAL CODE:</label>
          <input
            type="text"
            name="referralCode"
            value={referralCode}
            onChange={this.handleChange}
            className="form-control mb-4"
            required
          ></input>
          <a href="" target="_blank">
            Terms and Conditions
          </a>
          <div className="form-check">
            <input
              type="checkbox"
              name="term1"
              onChange={this.handleToggleCheckbox}
              className="form-check-input"
            ></input>
            <label htmlFor="accept-terms" className="form-check-label mb-4">
              I HAVE READ AND AGREE FOR TERMS SERVICE
            </label>
          </div>
          {isSubmitting ? (
            <button className="btn btn-success" disabled>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              />
              SIGNING UP...
            </button>
          ) : (
              <button className="btn btn-primary" onClick={this.handleSubmit}>
                SIGNUP
              </button>
            )}
        </form>
      </div>
    );
  }
}

export default Signup;
