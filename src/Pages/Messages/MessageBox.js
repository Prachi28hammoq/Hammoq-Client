import React, { Component, Fragment } from "react";
import { socket } from "../../services/socket";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";

import $ from "jquery";
// import "./chat.css";
// import "./MessageBox.css";
import "./messagesbox.css";
import Modal from "react-bootstrap/Modal";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Axios from "../../services/Axios";
// const io = require("socket.io-client");
// const socket = io.connect("https://devcust.avoidpoints.com");

export default class extends Component {
  constructor() {
    super();
    this.state = {
      clientId: localStorage.getItem("cid"),
      messages: [],
      message: "",
      customerName: localStorage.getItem("customerName"),
    };

    socket.on("messages", (data) => {
      if (data) {
        this.setState({ messages: data.messages });
      }
    });
    socket.on("newmessage", (data) => {
      var messages = this.state.messages;
      messages.push(data.message);
      this.setState({ messages: messages });
    });
  }

  // componentDidMount = async () => {
  //   const response = await Axios.get(`/globalmessage/agent`, {
  //       headers : {
  //         'x-access-token' : localStorage.getItem('token')
  //       }
  //   })
  //   this.setState({agents : response.data})
  // }
  componentDidMount = () => {
    socket.emit("user-connected", {
      roomId: this.state.clientId,
      tag: "client",
    });
  };

  // componentDidUpdate = () => {
  //      socket.emit('user-connected', this.state.clientId)
  // }

  componentDidUpdate() {
    var div = document.getElementById("msg_body");
    if (div != null) div.scrollTop = div.scrollHeight - div.clientHeight;
  }

  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };

  handleMessageSend = () => {
    let roomId = this.state.clientId;
    const message = {
      text: this.state.message,
      date: moment(),
      senderName: this.state.customerName,
      tag: "client",
    };
    socket.emit("newmessage", message, roomId);
    this.setState({ message: "" });
  };

  render() {
    return (
      <Modal
        show={this.props.modalOpen}
        onHide={this.props.handleModalOpen}
        backdrop={false}
        // backdrop= "false"
        // fade="false"
        style={{ marginTop: "42px", width: "340px", marginLeft: "850px"}}
      >
        <div class="con">
          <div id="head">
            {/* <img src="https://www.google.com/search?q=user+profile+icon&safe=active&client=ms-android-karbonn&prmd=ivmn&source=lnms&tbm=isch&sa=X&ved=2ahUKEwi-ub2QxYLpAhXCjOYKHbPJCSsQ_AUoAXoECAwQAQ&biw=377&bih=626#imgrc=P-UvjzWEJi0CwM"><h1>Tech With Onkar</h1><h3>Online</h3> */}
          </div>
          <div id="msg_body">
            {this.state.messages.map((data) => {
              if (data.tag == "client") {
                return (
                  <div className="outgoing_msg">
                    <div className="sent_msg">
                      <div>{data.senderName}</div>
                      <p>{data.text}</p>
                      <span className="time_date">
                        {moment(data.date).format("ll")}
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="incoming_msg">
                    <div className="receive_msg">
                      <div className="received_withd_msg">
                        <div>{data.senderName}</div>
                        <p>{data.text}</p>
                        <span className="time_date">
                          {moment(data.date).format("ll")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {/* <div id="user1">Hi</div>
        <div id="user2">Hello</div>
        <div id="user1">How are you?</div>
        <div id="user2">I am fine and what about you?</div>
        <div id="user1">I am also fine but I am getting bored here.</div>
        <div id="user2">So you can spend your time at youtube watching programming videos.</div>
        <div id="user2">I am sure you will learn something new.</div>
        <div id="user1">Ok Sure</div><div id="user2">Don't forget to subscribe me.</div>
        <div id="user2">In case of any problem you can contact me via whatsapp 9064973840.</div> */}
          </div>
          <div id="msg_btm">
            {/* <form id=""> */}
            <input
              type="text"
              id="text"
              name=""
              placeholder="Enter your Message..."
              autocomplete="off"
            />
            <button
              class="msg_send_btn"
              type="button"
              onClick={this.handleMessageSend}
            >
              <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
            </button>
            {/* </form> */}
          </div>
        </div>
      </Modal>
    );
  }
}

// <div className="container">
{
  /* <div className="msg-header">
          <div className="msg-header-img">
            <img src={user} />
          </div>
          <div className="active">
            <h4>Jhon Lewis</h4>
            <h6>Active 3 hours ago</h6>
          </div>
          <div className="header-icon">
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
          </div>
        </div> */
}

{
  /* <div className="chat-page">
          <div className="msg-inbox">
            <div className="chats">
              <div className="msg-page">
                <div className="received-chats">
                  <div className="received-chats-img">
                    <img src={user} />
                  </div>
                  <div className="received-img">
                    <div class="received-img-inbox">
                      <p>Hi!!! This is message from Jhon Lewis</p>
                      <p>What can I do for you?</p>
                      <span className="time">11:01 PM</span>
                    </div>
                  </div>
                </div>
                <div className="outgoing-chats">
                  <div class="outgoing-chats-msg">
                    <p>Hi!!! This is message</p>
                    <span className="time">11:01 PM</span>
                  </div>
                  <div className="outgoing-chats-img">
                    <img src={user} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="input-group" style={{position: "fixed"}}>
              <input
                type="text"
                onchange={this.state.handleMessage}
                className="form-control"
                placeholder="write a message"
              />          
              <button className="input-group-append" type="button"
                    onClick={this.state.handleSendMessage}>
                  <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
              </button>
          </div>
        </div>
      </div> */
}

//   <div className="container">
//     <div className = "row">
//       <div className = "chat col-md-12">
//         <div style = {{height : '65vh' , overflow : 'auto' }} id = "msg_history">
//           {
//             this.state.messages.map((data) => {
//               if(data.tag == "client" ){
//                 return (
//                   <div className = 'outgoing_msg'>
//                       <div className="sent_msg">
//                         <div >
//                             {data.senderName}

//                         </div>
//                         <p>{data.text}</p>
//                         <span className = 'time_date'>{moment(data.date).format('ll')}</span>
//                       </div>
//                     </div>
//                 )
//               }else {
//                 return (
//                   <div className = 'incoming_msg'>
//                       <div className="receive_msg">
//                         <div className = "received_withd_msg">
//                           <div>
//                           {data.senderName}
//                           </div>
//                             <p>{data.text}</p>
//                             <span className = 'time_date'>{moment(data.date).format('ll')}</span>
//                         </div>
//                       </div>
//                     </div>
//                 )
//               }
//             })
//           }
//         </div>
//       <div class="type_msg">
//         <div class="input_msg_write">
//           <TextareaAutosize
//             rowsMax={2}
//             aria-label="maximum height"
//             class="write_msg"
//             placeholder="Type a message"
//             value = {this.state.message}
//             id="msg"
//             style={{ width: "90%" }}
//             onChange={(e) => this.handleChange(e)}
//           />

//           <button
//             class="msg_send_btn"
//             type="button"
//             onClick={this.handleMessageSend}
//           >
//             <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
//           </button>
//         </div>
//       </div>
//       </div>
//   </div>
//   </div>
