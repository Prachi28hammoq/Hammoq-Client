import React from "react";
import "./chat.css";
// import { socket } from "../../services/socket";
import moment from "moment";
import socket from "../../services/socket";
import Axios from "../../services/Axios";
//modal
import Modal from "react-bootstrap/Modal";
// import SendMsg from "./SendMsg";
class ChatMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: "",
      canMessageSend: false,
    };
    socket.on("messages", (data) => {
      //console.log(data, "message__btn");
      if (data) {
        this.setState({ messages: data.messages });
      }
    });
    socket.on("newmessage", (data) => {
      console.log(data, "message__btn");
      var messages = this.state.messages; ///
      messages.push(data.message);
      this.setState({ messages: messages });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props != prevProps) {
      this.handleRoomJoin();
    }
  }
  handleRoomJoin = () => {
    this.setState({ messages: [] });
    socket.emit("user-connected", { roomId: this.props.roomId, tag: "client" });
    this.setState({ roomId: this.props.roomId, canMessageSend: true });
  };
  handleMessageSend = () => {
    let roomId = this.props.roomId;
    const message = {
      text: this.state.message,
      date: moment(),
      senderName: this.props.agentName,
      tag: "client"
    };
    socket.emit("newmessage", message, roomId);
    this.setState({ message: "" });
  };
  handleChange = (event) => {
    //console.log(event)
    this.setState({ message: event.target.value });
  };

  render() {
    console.log(this.state.messages, this.props, "render messages");
    return (
      <Modal
        show={this.props.modalOpen}
        onHide={this.props.handleModalOpen}
        style={{
          top: "100px",
          left: "1050px",
          width: "22%",
          borderRadius: "10px",
        }}
      >
        <div
          className="main-container"
          style={{ height: "60vh", borderRadius: "10px" }}
        >
          <div className="msg-header">
            <div className="header-icon">
              <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
            </div>
          </div>
          <div className="chat-page">
            {this.state.messages.map((data) => {
              if (data.tag == "client") {
                return (
                  <div className="outgoing-chats">
                    <div className="outgoing-chats-msg">
                      <p>{data.text}</p>
                      <span className="time">
                        {moment(data.date).format("lll")}
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="received-img">
                    <div class="received-img-inbox">
                      {data.text}
                      <span className="time">
                        {moment(data.date).format("ll")}
                      </span>
                    </div>
                  </div>
                );
              }
            })}

            <div className="msg-btm">
              <div className="chat-btm">
                <input
                  type="text"
                  id="text"
                  onChange={(e) => this.handleChange(e)}
                  // className="form-control"
                  placeholder="write a message"
                  value={this.state.message}
                  style={{ marginBottom: "0" }}
                />
                <button
                  className="msg_send_btn"
                  type="button"
                  onClick={this.handleMessageSend}
                  style={{
                    position: "absolute",
                    border: "0",
                    top: "19px",
                    right: "17px",
                    cursor: "pointer",
                    outline: "0",
                    bottom: "0",
                    paddingBottom: "2px",
                    top: "330px",
                  }}
                  // style={{marginBottom: "0", padding:"12px", outline:"none", border:"none", backgroundColor:"#007bff"}}
                >
                  <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
                  {/* <i class="fa fa-paper-plane-o" aria-hidden="true"></i> */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ChatMessages;
