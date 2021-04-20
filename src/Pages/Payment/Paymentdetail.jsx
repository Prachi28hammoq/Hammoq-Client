import React, { Component } from "react";
import "./addpayment.css";
import Navbar from "../navbar/Navbar";
import { API_URL } from "../../services/url";
import authService from "../../services/auth-service";
import { Redirect } from "react-router-dom";
import axios from "axios";
//import { loadStripe } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";

class AddPayment extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      input1: "",
      input2: "",
      input3: "",
      getpaymentdetail: [],
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(
        API_URL + `user/payment/getpaymentdetail`,
        (axios.defaults.headers.common[
          "authorization"
        ] = `bearer ${localStorage.getItem("token")}`),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data.success) {
        this.setState(
          {
            getpaymentdetail: response.data.getpaymentdetail,
            name: response.data.userdetail.name,
            email: response.data.userdetail.email,
          },
          () => {
            console.log("domain", this.state.getpaymentdetail);
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  change = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSubmit = async (event) => {
    localStorage.setItem("status", "1");
    event.preventDefault();
    let check = {
      listing_on_eBay: this.state.listing_on_eBay,
      crosslist_on_Mercari: this.state.crosslist_on_Mercari,
      crosslist_on_Poshmark: this.state.crosslist_on_Poshmark,
      delist_once_item_is_sold: this.state.delist_once_item_is_sold,
    };
    let arr = [];
    for (var key in check) {
      if (this.state[key] === true) {
        arr.push(key);
      }
    }

    check = arr.toString();

    // console.log("check", check);
    const { stripe, elements } = this.props;
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    const tokenvalue = localStorage.getItem("usertoken");
    let body = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      check,
      card_details: result.token,
      price: "9900",
    };
    if (result.error) {
      console.log(result.error.message);
      return alert(result.error.message);
    } else {
      let response = await axios.post(
        `${API_URL}user/payment/addpayment`,
        body,
        (axios.defaults.headers.common[
          "authorization"
        ] = `bearer ${localStorage.getItem(token)}`)
      );
      if (response.data.success) {
        alert(response.data.msg);
        this.props.history.push("/addpassword");
      } else {
        //console.log(respone.data,'bhghjghjggfhghjghjghjghjghjghjghjghjgjgjhgj')
        alert(response.data.msg);
      }
    }
  };

  change = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onChangeRadio = (e) => {
    this.setState(
      {
        list: e.target.value,
      },
      () => console.log("list", this.state.list)
    );
  };
  addpayment = (e) => {
    e.preventDefault();

    axios
      .post(`${API_URL}admin/login`, this.state)
      .then(
        function (response) {
          if (response.data.msg !== "Wrong password") {
            localStorage.setItem("usertoken", response.data.tokenkey);
            console.log(localStorage.getItem("usertoken"));
            this.props.onRouteChange("home");
            return <Redirect to={{ pathname: "/" }} />;
          }
          console.log("authservice gettoken");
          alert(response.data.msg);
          console.log(authService.getToken());
        }.bind(this)
      )
      .catch((error) => {
        console.log(error);
      });
  };

  change = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <div className="container">
        <div>
          <h5 className="text-lg-center mt-4 heading mb-4">
            Payment & Actions
          </h5>
        </div>

        <div className=""></div>
        <div className="sub-heading mb-3">Previous Transaction</div>
        <table className="table">
          <tr>
            <th>Amount</th>
            <th>Date Taken</th>
            <th>Receipt Url</th>
          </tr>
          {this.state.getpaymentdetail.map((user, index) => {
            var date = new Date(`${user.date_taken}`).toLocaleString();
            return (
              <tr>
                <td>${user.amount / 100}</td>
                <td>{date}</td>
                <td>
                  <a href={user.receipt_url} target="_blank" rel="noreferrer">
                    Receipt
                  </a>
                </td>
              </tr>
            );
          })}
        </table>

        <div style={{ marginBottom: "70px" }}></div>
        <Navbar />
      </div>
    );
  }
}

export default AddPayment;
