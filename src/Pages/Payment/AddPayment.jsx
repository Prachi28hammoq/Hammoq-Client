import React, { Component } from "react";
import "./addpayment.css";
import { CardElement } from "@stripe/react-stripe-js";
//import { Link } from "react-router-dom";
//import Header from "../../Components/header/header";
//import hammock from "../../Components/images/hammock.svg";
import Axios from "../../services/Axios";
import LoadingSpinner from "../utils/loader";

const $ = window.$;

class AddPayment extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      name: "",
      loading: false,
      
    };
  }

  paymentHandler = async () => {
    const { stripe, elements } = this.props;

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    let price = 100; //dollars

    //console.log(result);
    this.setState({ loading: true });
    if (localStorage.getItem("paymentadded") === "true") {
      price = 1; //dollars
    }
    if (result.error) {
      //console.log(result.error)
      alert("Fill up the details");
      this.setState({ loading: false });
    }
    await Axios.post("/payment/firstpayment", {
      email: this.state.email,
      card_details: result,
      price: price,
    })
      .then((res) => {
        Axios.put("/payment/addstatus")
          .then((res) => {
            localStorage.setItem("paymentadded", res.data.paymentStatus);
            if (price === 1) {
              alert("$1 has been added");
              this.setState({ loading: false });
              window.open("/setting", "_self");
            } else {
              alert("$100 has been added");
              this.setState({ loading: false });
              window.open("/basic", "_self");
            }
          })
          .catch((err) => {
            if (err.response.data.err) {
              return alert(err.response.data.err);
            }
            this.setState({ loading: false });
            alert("Something went wrong.");
            console.log(err);
          });
        //window.open("/products", "_self");
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("Something went wrong.");
        console.log(err);
      });
  };

  componentDidMount(prevProps) {
    Axios.get("/clientdetails")
      .then(({ data }) => {
        console.log(data,'client detail')
        this.setState({ email: data.email });
        this.setState({ name: data.firstName });

        if (
          data.paymentStatus === true &&
          !localStorage.getItem("paymentadded")
        ) {
          console.log(data);
          localStorage.setItem("paymentadded", data.paymentStatus);
          window.open("/basic", "_self");
        }
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  }

  render() {
    return (
      <div className="my-login-page">
        <section className="h-100">
          <div className="container h-100">
            <div
              className="modal fade  bd-example-modal-sm"
              id="addTemplateModal"
              tabIndex={-1}
              role="dialog"
              aria-labelledby="addTemplateModalLabel"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-sm  modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h6
                      className="modal-title text-center"
                      id="addTemplateModalLabel"
                      style={{ color: "#4db0cc" }}
                    >
                      <i
                        class="fa fa-exclamation-triangle"
                        aria-hidden="true"
                        style={{ color: "red" }}
                      ></i>{" "}
                      Are you sure you want to add card details ?
                    </h6>
                  </div>
                  <div className="text-center p-2">
                    <button
                      className="btn btn-success mr-2 py-2"
                      onClick={() => {
                        this.paymentHandler();
                        $("#addTemplateModal").modal("hide");
                      }}
                      style={{
                        width: "60px",
                        height: "30px",
                        lineHeight: "10px",
                        textAlign: "center",
                        boxSizing: "border-box",
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm m-auto py-2"
                      data-dismiss="modal"
                      aria-label="Close"
                      style={{
                        width: "60px",
                        height: "30px",
                        lineHeight: "10px",
                        textAlign: "center",
                        boxSizing: "border-box",
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-md-center h-100 m-4">
              <div className="card-wrapper">
                <div className="card fat custom-card-margin">
                  <div className="card-body">
                    <div>
                    </div>
                    {localStorage.getItem("paymentadded") === "true" ? (
                      <>
                        <div className="text-center ">
                          <h4 className="mt-4 mb-4 heading">
                            Payment & Actions
                          </h4>
                          <label>
                            To add/change payment card please add a credit card,
                            <br />{" "}
                            {localStorage.getItem("paymentadded") === "true"
                              ? "$1 will be deducted"
                              : "$100 for your initial listing."}
                          </label>
                        </div>

                        <div className="">
                          <form style={{ width: "300px", margin: "auto" }}>
                            {this.state.loading ? (
                              <div className="center">
                                <LoadingSpinner asOverlay />
                              </div>
                            ) : null}
                            <input type="hidden" />
                            <br />
                            <CardElement />
                            
                            <button
                              type="button"
                              onClick={() =>
                                $("#addTemplateModal").modal("show")
                              }
                              className="btn btn-block btn-primary btn-sm my-3 py-2"
                            >
                              Pay
                            </button>
                            {/* <div className="py-2">
                              <div className="sub-heading">
                                What we can automate for you
                              </div>
                              <p className="body-text mb-0 mt-2">
                                1. Listing on eBay
                              </p>
                              <p className="body-text mb-0 mt-2">
                                2. Crosslist on Mercari
                              </p>
                              <p className="body-text mb-0 mt-2">
                                3. Crosslist on Poshmark
                              </p>
                              <p className="body-text mb-0 mt-2">
                                4. Delist once item is sold
                              </p>
                            </div> */}
                          </form>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <h4 className="mt-4 mb-4 heading">
                            Payment & Actions
                          </h4>
                          <label>
                            <small>
                              Please provide a credit card for initial payment,
                              This credit will be used for your listing and
                              cross listing automation
                            </small>
                          </label>
                        </div>

                        <div className="">
                          <form style={{ width: "300px", margin: "auto" }}>
                            {this.state.loading ? (
                              <div className="center">
                                <LoadingSpinner asOverlay />
                              </div>
                            ) : null}
                            <input type="hidden" />
                            <br />
                            <CardElement />
                            <button
                              type="button"
                              onClick={() =>
                                $("#addTemplateModal").modal("show")
                              }
                              className="btn btn-block btn-primary btn-sm my-3 py-2"
                            >
                              Pay
                            </button>
                            <div className="py-2">
                              <div className="sub-heading">
                                <small>
                                  You will be charged initially $100. This
                                  charge is fully refundable if you decide not
                                  to continue with our service.
                                </small>
                              </div>
                              <p></p>
                              <p>
                                <small>
                                  Once the initial charge has been fully debited
                                  we’ll automatically charge you another $100
                                  for more listings.
                                </small>
                              </p>
                              <p>
                                <small>
                                  We charge $1.45 per listing and $0.45 per
                                  crosslisting per site when we automate it
                                  100%.
                                </small>
                              </p>
                            </div>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default AddPayment;
