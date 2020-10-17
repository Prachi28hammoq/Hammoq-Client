import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./AddPassword.css";
import Axios from "../../services/Axios";

class Passwords extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      users: [],
      website: "",
      Ebay: true,
      Poshmark: true,
      Mercari: true,
      others: false,
    };
  }

  //get password
  componentDidMount = () => {
    Axios.get("/password").then(({ data }) => {
      console.log(data);
      if (data.passwords) this.setState({ users: data.passwords });
    });

    Axios.get("/password/getstatus").then(({ data }) => {
      console.log(data);
      this.setState({ Ebay: !data.Ebay });
      this.setState({ Poshmark: !data.Poshmark });
      this.setState({ Mercari: !data.Mercari });
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    if (value == "Others") {
      this.setState({ others: true });
    } else {
      if (value == "Ebay" || value == "Poshmark" || value == "Mercari") {
        this.setState({ others: false });
      }
      this.setState({ [name]: value });
    }
  };

  handleSubmit = (e) => {
    //destructure
    const { website, username, password, users } = this.state;
    e.preventDefault();
    if (website != "" && username != "" && password != "") {
      Axios.post("/password", {
        website: website,
        username: username,
        password: password,
      })
        .then((response) => {
          let user = {
            website: website,
            username: username,
            password: password,
          };
          users.push(user);

          this.setState({ [website]: false });

          this.setState(
            {
              users: users,
            },
            () => {
              this.setState({
                username: "",
                password: "",
                website: "",
              });
            }
          );
        })
        .catch((err) => {
          this.setState({ isSubmitting: true });
          console.log(err) || alert(JSON.stringify({ err: err }));
        });
    } else {
      alert("Fill up the details");
    }
  };
  handleeBaySubmit = () => {
    Axios.get("/ebay/consent") //Ebay login
      .then((response) => {
        console.log(response);
        window.open(response.data.url, "_blank");
      })

      .catch((err) => {
        console.log(err) || alert(JSON.stringify({ err: err }));
      });
  };
  render() {
    const {
      website,
      username,
      password,
      users,
      Ebay,
      Poshmark,
      Mercari,
      others,
    } = this.state;
    return (
      <div>
        <div className="container">
          <div>
            <div>
              <h5 className="text-center mt-4 mb-4 heading">
                Log in Information
              </h5>
            </div>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="card p-4 mb-4">
                  <h6 className="mb-3  sub-heading">
                    Please enter the information for the sites you want us to
                    automate for you
                  </h6>
                  <select
                    className="form-control body-text"
                    name="website"
                    value={website}
                    onChange={this.handleChange}
                  >
                    <option>Please select a site to list on</option>
                    {Ebay ? <option defaultValue="Ebay">Ebay</option> : null}
                    {Poshmark ? (
                      <option defaultValue="Poshmark">Poshmark</option>
                    ) : null}
                    {Mercari ? (
                      <option defaultValue="Mercari">Mercari</option>
                    ) : null}
                    <option defaultValue="other">Others</option>
                  </select>
                  <br />
                  {others ? (
                    <>
                      <input
                        type="text"
                        placeholder="Website"
                        className="form-control mt-3"
                        name="website"
                        defaultValue=""
                        onChange={this.handleChange}
                      />
                      <br />
                    </>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Username"
                    className="form-control mt-3 body-text"
                    name="username"
                    value={username}
                    onChange={this.handleChange}
                  />
                  <br />
                  <input
                    type="text"
                    placeholder="Password"
                    className="form-control mt-3"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                  <br />
                  <div>
                    <button
                      className="btn btn-danger mt-3"
                      onClick={this.handleSubmit}
                    >
                      Add
                    </button>
                    <button
                      className="btn btn-danger ml-2 mt-3"
                      onClick={this.handleeBaySubmit}
                    >
                      Add eBay Login
                    </button>
                    {/* <small className="ml-2">
                      Note: For “Hammoq Lite” only eBay, Poshmark, and Mercari
                      are supported
                    </small> */}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                {users &&
                  users.map((user) => {
                    return (
                      <div className="card  p-4 mb-4">
                        <h6 className="sub-heading">{user.website}</h6>
                        <input
                          type="text"
                          placeholder="Ebay username"
                          className="form-control  mt-3"
                          name="username"
                          value={user.username}
                          disabled
                        />
                        <br />
                        <input
                          type="text"
                          placeholder="Ebay Password"
                          className="form-control mt-3"
                          value={user.password}
                          name="password"
                          disabled
                        />
                        <br />
                        <div>
                          <Link to={`/editpasswords/${user.website}`}>
                            <button className="btn btn-success body-text custom-edit-btn mt-3 btn-sm">
                              Edit
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div style={{ marginBottom: "60px" }}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Passwords;
