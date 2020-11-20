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
      // chatpopOpen: false,
      // modal
      modalOpen: false,
      search:"",
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

  // handleMessageSend = () => {
  //   let roomId = this.state.roomId;
  //   const message = {
  //     text: this.state.message,
  //     date: moment(),
  //     senderName: this.state.agentName,
  //     tag: "agent",
  //   };
  //   socket.emit("newmessage", message, roomId);
  //   this.setState({ message: "" });
  // };

  // handleClick = () => {

  // }

  updateSearch= event =>{
    this.setState({search:event.target.value});
}


  togglePopover = () => {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  };
  toggleChatPopover = () => {
    //var clinetId = ""
    // let id = this.state.clients.map((client) => client._id)
    // console.log(id)
    this.setState({ chatpopOpen: !this.state.chatpopOpen });
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
    const { popoverOpen } = this.state;
    const { chatpopOpen } = this.state;
    // console.log(this.state.clients, "hello");
    // let clients = this.state.clients.filter((client)=> {
    //   return (
    //     client.firstName
    //       .toLowerCase()
    //       .indexOf(this.state.search.toLowerCase())!== -1
    //   );
    // });

    return (
      <div 
      // style={{overflowY:"Hidden", margin:"0", padding:"65px"}}
      >
        <Button id="mypopover" type="button" onClick={this.handleModalOpen} style={{borderRadius:"50px", margin:"20px", width:"10%"}}>
          {/* <div className="user-img"></div> */}
          {/* Msg Popup */}
          <i class="fa fa-comments" aria-hidden="true" style={{fontSize:"50px", alignContent:"center", alignItems:"center", textAlign:"center"}}></i>
        </Button>
        <ChatMessages
          modalOpen={this.state.modalOpen}
          handleModalOpen={this.handleModalOpen}
          roomId={this.state.roomId}
        >
          <div
            id="chatpopover"
            style={{ border: "none", outline: "none", textDecoration: "none" }}
          ></div>
        </ChatMessages>
      </div>
    );
  }
}

export default PopUpMessage;
