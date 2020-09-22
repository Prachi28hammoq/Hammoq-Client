import React, { Component } from "react";
import "./title.css";
import Axios from "../../services/Axios";

class resetpassword extends Component {
  constructor() {
    super();
    this.state = {
      type: "",
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

  submit = async (e) => {
    e.preventDefault();
    console.log(this.state.type);
    localStorage.setItem("titletype", this.state.type);
    window.open("/setting", "_self");
    return alert("Changes saved successfully");
  };

  render() {
    return (
      <div className="settingsIt">
        <div className="row" id="profilephoto">
          <div className="col-12">
            <form>
              <input
                type="radio"
                id="type1"
                name="type"
                value="type1"
                onChange={this.handleChange}
              />
              <label for="type1">brand + category + model</label>
              <br />
              <input
                type="radio"
                id="type2"
                name="type"
                value="type2"
                onChange={this.handleChange}
              />
              <label for="type2">brand + model + category</label>
              <br />

              <br />
              <input type="submit" onClick={this.submit} />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default resetpassword;
