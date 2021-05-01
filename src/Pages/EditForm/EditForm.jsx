import React, {Component} from "react";
import ReactDOM from 'react-dom';
import {AdvanceListing} from "@hammoq/hammoq-recycledcomponents";
import Axios, { assetsURL } from "../../services/Axios";

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goToPreviousPath = () => {
    this.props.history.goBack();
  };

  render = () => {
  const { id } = this.props.match.params;

  return(
    <>
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <IconButton aria-label="close" onClick={this.goToPreviousPath}>
        {/*RETURN BACK TO GOBACK FUNCTION.*/}
        <KeyboardBackspaceIcon />
      </IconButton>
    </div>
    <AdvanceListing
    assetsURL={assetsURL}
    Axios={Axios}
    productid={id}
    />
    </>
    );
  }
}

export default EditForm;