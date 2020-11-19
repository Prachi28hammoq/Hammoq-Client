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
      clients: [],
      messages: [],
      message: "",
      roomId: "",
      agentName: "",
      canMessageSend: false,
      //anchorEl: null,
      popoverOpen: false,
      // chatpopOpen: false,
      // modal
      modalOpen: false,
      search:"",
    };
    // socket.on("messages", (data) => {
    //   if (data) {
    //     this.setState({ messages: data.messages });
    //   }
    // });
    // socket.on("newmessage", (data) => {
    //   var messages = this.state.messages; ///
    //   messages.push(data.message);
    //   this.setState({ messages: messages });
    // });
  }

  componentDidMount = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    const agentid = decoded._doc._id;
    //const response = await Axios.get(`/client/allocated/${agentid}`);
    //this.setState({ clients: response.data });
    ///////////////////
    const response1 = await Axios.get(`/agentdetail/${agentid}`);
    this.setState({ agentName: response1.data.username });
  };
  // componentDidUpdate() {
  //   var div = document.getElementById("msg_history");
  //   div.scrollTop = div.scrollHeight - div.clientHeight;
  // }

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

  handleUserList = async () => {
    console.log("user list");
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    const agentid = decoded._doc._id;
    const response = await Axios.get(`/client/allocated/${agentid}`);
    this.setState({ clients: response.data });
    //////////////////////////////////////////////
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
          agentName={this.state.agentName}
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
