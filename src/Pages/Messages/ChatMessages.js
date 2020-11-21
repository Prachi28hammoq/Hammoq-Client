import React from "react";
import "./chat.css";
// import { socket } from "../../services/socket";
import moment from "moment";
import socket from "../../services/socket";
import Axios from "../../services/Axios";
//modal
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
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
      //console.log(data, "message__btn");
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
    //console.log(this.props.match.params.id,'idddddddddddd')
    if (this.state.message.trim() != "") {
      const productId = localStorage.getItem("prodMsgId");
      let roomId = this.props.roomId;
      const message = {
        text: this.state.message.trim(),
        date: moment(),
        senderName: this.props.agentName,
        tag: "client",
        productId,
      };
      socket.emit("newmessage", message, roomId);
    }
    this.setState({ message: "" });
  };
  handleChange = (event) => {
    //console.log(event)
    this.setState({ message: event.target.value });
  };

  render() {
    //console.log(this.state.messages, this.props, "render messages");
    return (
      <Modal
      className="modal-side modal-bottom-right modal-fade-right"
      size="sm"
      show={this.props.modalOpen}
      onHide={this.props.handleModalOpen}
      style={{
        right:"0",
        borderRadius: "10px",
        top: "38%",
        bottom:"0",
        left: "38%",
        transform: "translate(-38%, 38%) !important",
      }}
      >
        <div className="main-container">
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
                      <p>hello</p>
                      <p>{data.text}</p>
                      <span className="time">
                        {moment(data.date).format("lll")}
                      </span>
                      {data.productId && (
                        <small>
                          <Link to={`/edit/${data.productId}`}>
                            for Product
                          </Link>
                        </small>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="received-chat">
                    <div class="received-chat-inbox">
                      <p>Hello</p>
                      <p>{data.text}</p>
                      <span className="time">
                        {moment(data.date).format("ll")}
                      </span>
                      {data.productId && (
                        <small>
                          <Link to={`/edit/${data.productId}`}>
                            for Product
                          </Link>
                        </small>
                      )}
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
                  placeholder="write a message"
                  value={this.state.message}
                  style={{ 
                    marginBottom: "5px", 
                    bottom: "0", 
                    // padding: "5" 
                  }}
                />
                <button
                  className="msg_send_btn"
                  type="button"
                  onClick={this.handleMessageSend}
                  style={{
                    position: "absolute",
                    border: "0",
                    right: "13px",
                    cursor: "pointer",
                    outline: "0",
                    bottom: "0",
                    margin:"2px",
                    padding: "15px 10px 10px 10px",
                    background:"none",
                  }}
                >
                  <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
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
