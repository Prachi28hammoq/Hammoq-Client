import React, { Component } from "react";
import "./Login.css";
import hammock from "../../Components/images/hammock.svg";
import Axios from "../../services/Axios";
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isSubmitting: false,
      loginError: false,
    };
  }

  handleSubmit = async (e) => {
    this.setState({ isSubmitting: true });
    e.preventDefault();
    await Axios.get("/signin", { params: this.state })
      .then(({ data }) => {
        if (data.err) {
          this.setState({ isSubmitting: false });
          this.setState({ loginError: true });
          return;
        }
        localStorage.setItem("token", data.token);
        window.open("/basic", "_self");
      })
      .catch((err) => {
        this.setState({ isSubmitting: false });
        this.setState({ loginError: true });
      });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { email, password, isSubmitting, loginError } = this.state;
    return (
      <div>
        <div className="row login-page">
          <div className="col-lg-5 m-auto">
            <div className="row">
              <img
                src={hammock}
                className="m-auto col-8"
                style={{ width: "170px", height: "120px" }}
              ></img>
            </div>
            <div className="d-flex justify-content-center">
              <p className="h5 py-2 logotitle" style={{fontSize:"2rem"}}>Photo and Forget it</p>
            </div>
            <div className="col-lg-8 col-10 m-auto resp-col">
              <div
                className="card border-0 login-container shadow rounded-1"
                style={{ backgroundColor: "#4db0cc" }}
              >
                <form className="card-body p-2" onSubmit={this.handleSubmit}>
                  <h5
                    className="card-title text-center h3 py-2"
                    style={{ color: "white" }}
                  >
                    Sign In
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
                  <div class="input-group input-group-lg mt-3">
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
                      placeholder="Password"
                      required
                      name="password"
                      onChange={this.handleChange}
                      value={password}
                    ></input>
                  </div>
                  {isSubmitting ? (
                    <button
                      className="btn bg-success text-white btn-block rounded-1 mt-3 py-2"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      />
                      LOGGING IN...
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary col-5 col-lg-4 text-white btn-block  m-auto py-2"
                      type="submit"
                    >
                      LOGIN
                    </button>
                  )}
                  <hr />
                </form>
                <div class="d-flex justify-content-center mb-4">
                  <a href="/signup">
                    <button className="btn btn-primary">
                      Create new account
                    </button>
                  </a>
                </div>
                <div class="d-flex justify-content-center mb-4">
                  <a href="/forgotpassword">
                    <button className="btn btn-warning">Forgot password</button>
                  </a>
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
