import React, { Component } from "react";
import { Link } from "react-router-dom";
import Axios from "../../services/Axios";

class Editdomain extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
    };
  }

  componentDidMount = () => {
    const { website } = this.props.match.params;
    Axios.get("/password")
      .then((response) => {
        response.data.passwords.map((user) => {
          if (user.website === website) {
            this.setState({ users: user });
          }
        });
      })
      .catch((err) => {
        console.log(err) || alert(JSON.stringify({ err: err }));
      });
  };

  handleChange = (e) => {
    const { users } = this.state;
    const { value, name } = e.target;
    users[name] = value;
    this.setState({ users });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { users } = this.state;
    Axios.put("/password", users)
      .then((response) => 
      window.open("/passwords", "_self"))
      .catch((err) => {
        this.setState({ isSubmitting: true });
        console.log(err) || alert(JSON.stringify({ err: err }));
      });
  };

  render() {
    console.log(this.state.users, 'user datat ')
    const { users } = this.state;
    return (
      <div>
        <div className="skin-blue fixed-layout">
          <div className="page-wrapper">
            <div className="container mt-4">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-4 m-auto">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="text-center heading">
                        Edit The Logins to automate
                      </h5>
                      <input
                        type="text"
                        name="website"
                        className="form-control mt-3"
                        value={users.website || ""}
                        readOnly
                      />
                      <input
                        type="text"
                        className="form-control mt-3"
                        placeholder="Username"
                        name="username"
                        value={users.username || ""}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        className="form-control mt-3"
                        name="password"
                        placeholder="Password"
                        value={users.password || ""}
                        onChange={this.handleChange}
                      />
                      <div className="col d-flex justify-content-center">
                        <button
                          className="btn btn-success mt-3"
                          onClick={this.handleSubmit}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Editdomain;
