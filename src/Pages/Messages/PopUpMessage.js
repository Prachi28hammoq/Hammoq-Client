import React from "react";
import Axios from "../../services/Axios";
import { socket } from "../../services/socket";
import moment from "moment";
import "./chat.css";
import jwt_decode from "jwt-decode";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import "./PopUpMessage.css";
import ChatMessages from "./ChatMessages";

class PopUpMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      message: "",
      roomId: "",
      canMessageSend: false,
      //anchorEl: null,
      popoverOpen: false,
      modalOpen: false,
    };
  }

  componentDidMount = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    var id = decoded._doc._id;
    this.setState({ roomId:id });
  };

  handleRoomJoin = (id) => {
    this.setState({
      roomId: id,
      canMessageSend: true,
      // chatpopOpen: !this.state.chatpopOpen,
      modalOpen: !this.state.modalOpen,
    });
  };

  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };



  //modal
  handleModalOpen = () => {
    this.setState((prevState) => {
      return {
        modalOpen: !prevState.modalOpen,
      };
    });
  };



  render() {
    return (
      <div>
        <Button id="mypopover" type="button" onClick={this.handleModalOpen}>
          <i class="fa fa-comments" aria-hidden="true"></i>
        </Button>
        <ChatMessages
          modalOpen={this.state.modalOpen}
          handleModalOpen={this.handleModalOpen}
          roomId={this.state.roomId}
        >
        </ChatMessages>
      </div>
    );
  }
}

export default PopUpMessage;
