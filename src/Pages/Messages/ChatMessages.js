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
    var div = document.getElementById("msg_history");
    if (div) {
      div.scrollTop = div.scrollHeight - div.clientHeight;
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
        size="md"
        show={this.props.modalOpen}
        onHide={this.props.handleModalOpen}
        style={{
          borderRadius: "10px",
          top: "45%",
          left: "35%",
          transform: "translate(-35%, 45%) !important",
          backdrop: "none",
          keyboard: false,
          pointerEvents: 'none'
        }}
      >
        <div className="main-container">
          <div className="msg-header">
            <div className="header-icon">
              <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
            </div>
          </div>
          <div className="msg_history" id="msg_history">
            {this.state.messages.map((data) => {
              if (data.tag == "client") {
                return (
                  <div className="outgoing_msg">
                    <div className="sent_msg">
                      <p>{data.text}</p>
                      <span className="time_date">
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
                  <div className="incoming_msg">
                    <div class="received_msg received_withd_msg">
                      <div>
                        <p>{data.text}</p>
                      </div>

                      <span className="time_date">
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
              }
            })}
          </div>
          <div className="type_msg">
            <div className="input_msg_write">
              <input
                type="text"
                id="text"
                onChange={(e) => this.handleChange(e)}
                placeholder="write a message"
                value={this.state.message}
              />
            </div>

            <button
              className="msg_send_btn"
              type="button"
              onClick={this.handleMessageSend}
            >
              <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ChatMessages;
