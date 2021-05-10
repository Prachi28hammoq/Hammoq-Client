
import React, { Component } from "react";
import "./resetpasswordmin.css";
import Axios from "../../services/Axios";

class resetpassword extends Component {
  constructor() {
    super();
    this.state = {
      oldp: "",
      newp: "",
      cnewp: "",
      hidden: true,
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

  reset = async (e) => {
    e.preventDefault();
    //const agentid = localStorage.getItem("agent");
    if (this.state.newp === this.state.cnewp) {
      alert("Press ok to confirm password change");
       Axios.post("/resetpassword", {
        oldPassword: this.state.oldp,
        newPassword: this.state.newp,
      })
        .then(({ response }) => {
          console.log(response)
          alert("Success,changes saved");
        })
        .catch((err) => console.log(err) || alert(JSON.stringify(err)));
    } else {
      alert("Password unmatch");
    }
  };

  show = (e) => {
    this.setState({ hidden: !this.state.hidden });
  };

  render() {
    //const { oldp, newp } = this.state;
    return (
      <div className="settingsIt">
        <form onSubmit={this.reset}>
        <div className="dataRow">
        <label> Show/Hide: <input type="checkbox" onClick={this.show}/></label>
        </div>
        <div className="dataRow">
          <i className="fa fa-user" aria-hidden="true"></i>
          <input
            type={this.state.hidden ? "password" : "text"}
            className="dataFieldInput"
            placeholder="Old password"
            required
            name="oldp"
            onChange={this.handleChange}
            value={this.state.oldp}
          ></input>
        </div>
        <div className="dataRow">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input
            type={this.state.hidden ? "password" : "text"}
            className="dataFieldInput"
            placeholder="New Password"
            required
            name="newp"
            onChange={this.handleChange}
            value={this.state.newp}
          ></input>
        </div>
        <div className="dataRow">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input
            type={this.state.hidden ? "password" : "text"}
            className="dataFieldInput"
            placeholder="Confirm Password"
            required
            name="cnewp"
            onChange={this.handleChange}
            value={this.state.cnewp}
          ></input>
        </div>

        <button type="submit" className="btn btn-primary dataButton">
          Confirm Change
        </button>
      </form>
    </div>
    );
  }
}
export default resetpassword;
