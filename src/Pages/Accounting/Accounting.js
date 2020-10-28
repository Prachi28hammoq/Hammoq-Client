import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Accounting extends Component {
  render() {
    return (
      <div>
        <h3>Hello Accounting form</h3>
        <nav>
          <a href="/accounting">Accounting</a>
        </nav>
      </div>
    );
  }
}

export default withRouter(Accounting);