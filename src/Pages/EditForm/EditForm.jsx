import React, {Component} from "react";
import ReactDOM from 'react-dom';
import {AdvanceListing} from "@hammoq/hammoq-recycledcomponents";
import Axios, { assetsURL } from "../../services/Axios";

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
  const { id } = this.props.match.params;

  return(
    <AdvanceListing
    assetsURL={assetsURL}
    Axios={Axios}
    productid={id}
    />
    );
  }
}

export default EditForm;