import React, { Component } from "react";

import Axios from "../../services/Axios";
class AcceptUrl extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount = async (e) => {
    console.log(this.props.location);
    const url = this.props.location.search;

    await Axios.get("/ebay/acceptURL" + url, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    // const { email, password, isSubmitting, loginError } = this.state;
    return <div></div>;
  }
}

export default AcceptUrl;
