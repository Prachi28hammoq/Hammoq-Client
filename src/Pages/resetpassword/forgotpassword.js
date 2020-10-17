import React, { Component } from "react";
import "./forgotpassword.css";
import hammock from "../../Components/images/hammock.svg";
import Axios from "../../services/Axios";
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      code: "",
      isSubmitting: false,
      loginError: false,
      codesent: false,
      codecheck: false,
      passup: false,
      displaycode: false,
      displaypass: false,
    };
  }

  //new password update
  handleSubmit = async (e) => {
    this.setState({ isSubmitting: true });
    e.preventDefault();

    if (
      this.state.codesent == true &&
      this.state.codecheck == true &&
      this.state.passup == false
    ) {
      await Axios.post("/forgotpassword/update", {
        email: this.state.email,
        newPassword: this.state.password,
      })
        .then(({ data }) => {
          console.log(data);
          alert(data);
          this.setState({ passup: true });
          window.open("/products", "_self");
        })
        .catch((err) => {});
    }

    if (this.state.codesent == true && this.state.codecheck == false) {
      await Axios.get(
        `/forgotpassword/confirmCode/${this.state.code}/${this.state.email}`
      )
        .then(({ data }) => {
          localStorage.setItem("token", data.token);
          if (localStorage.getItem("token")) {
            alert("Code verified : Change new password or goto Products page");
            this.setState({ codecheck: true });
            this.setState({ displaypass: true });
          }
        })
        .catch((err) => {});
    }

    if (this.state.codesent == false) {
      await Axios.get(`/forgotpassword/${this.state.email}`)
        .then(({ data }) => {
          console.log(data);
          alert(data);
          this.setState({ codesent: true });
          this.setState({ displaycode: true });
        })
        .catch((err) => {});
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const {
      email,
      password,
      isSubmitting,
      loginError,
      code,
      displaycode,
      displaypass,
    } = this.state;
    return (
      <div>
        <div className="row login-page">
          <div className="col-12 col-lg-6 m-auto">
            <div className="row mt-5">
              <div className="col-8 m-auto resp-col">
                <div
                  className="card border-0 login-container shadow rounded-1 mt-5 h-100"
                  style={{ backgroundColor: "#4682B4" }}
                >
                  <form className="card-body p-4" onSubmit={this.handleSubmit}>
                    <h5
                      className="card-title text-center h3 py-2"
                      style={{ color: "white" }}
                    >
                      Forgot Password
                    </h5>
                    {loginError && (
                      <div className="col d-flex justify-content-center">
                        <div className="row">
                          <i
                            class="fa fa-times-circle text-danger"
                            aria-hidden="true"
                            style={{ width: "50" }}
                          ></i>
                          <div style={{ color: "red" }} className="ml-1">
                            <h5>Incorrect Email or Password</h5>
                          </div>
                        </div>
                      </div>
                    )}
                    <div class="input-group input-group-lg mt-3">
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text bg-white border-0 rounded-1-left pr-1"
                          id="inputGroup-sizing-lg"
                        >
                          <div class="fas fa-envelope" aria-hidden="true"></div>
                        </span>
                      </div>
                      <input
                        type="email"
                        class="form-control border-0 rounded-1-right pl-3 bg-white"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-lg"
                        placeholder="Email"
                        value={email}
                        name="email"
                        onChange={this.handleChange}
                        required
                      ></input>
                    </div>

                    <div
                      id="u"
                      className={
                        displaycode
                          ? "input-group input-group-lg mt-3" + " show"
                          : "input-group input-group-lg mt-3" + " hide"
                      }
                    >
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text bg-white border-0 rounded-1-left pr-1"
                          id="inputGroup-sizing-lg"
                        >
                          <div
                            class="fas fa-shield-alt"
                            aria-hidden="true"
                          ></div>
                        </span>
                      </div>
                      <input
                        type="text"
                        class="form-control border-0 rounded-1-right pl-3 bg-white"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-lg"
                        placeholder="code"
                        value={code}
                        name="code"
                        onChange={this.handleChange}
                      ></input>
                    </div>

                    <div
                      className={
                        displaypass
                          ? "input-group input-group-lg mt-3" + " show"
                          : "input-group input-group-lg mt-3" + " hide"
                      }
                    >
                      <div class="input-group-prepend mb-2">
                        <span
                          class="input-group-text bg-white border-0 rounded-1-left pr-1"
                          id="inputGroup-sizing-lg"
                        >
                          <div class="fas fa-lock" aria-hidden="true"></div>
                        </span>
                      </div>
                      <input
                        type="password"
                        className="form-control border-0 rounded-1-right mb-2 align-middle pl-3 bg-white"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-lg"
                        placeholder="New Password"
                        name="password"
                        onChange={this.handleChange}
                        value={password}
                      ></input>
                    </div>

                    <button
                      className="btn btn-info col-3 text-white btn-block rounded-1 m-auto py-2"
                      type="submit"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
