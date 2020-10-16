import React, { Component, Fragment } from "react";
//import { socket } from "../../services/socket";
import moment from 'moment'

import $ from "jquery";
import "./chat.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Axios from "../../services/Axios";
const io = require("socket.io-client");
const socket = io.connect("http://localhost:8000");


export default class extends Component {
  constructor(){
    super()
    this.state = {
      agents : [],
      clientId : localStorage.getItem('cid'),
      messages : [],
      message: '',
      customerName : localStorage.getItem('customerName'),
      agentId : ''
       
    }
    socket.on('messages', (data) => this.setState({messages : data.messages}))
    socket.on('newmessage', (data) => {var messages = this.state.messages
     messages.push(data.message)
     this.setState({messages : messages})
   })

  }

  

  componentDidMount = async () => {
    const response = await Axios.get(`/globalmessage/agent`, {
        headers : {
          'x-access-token' : localStorage.getItem('token')
        }
    })
    this.setState({agents : response.data})  
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      var div = document.getElementById("msg_history");
      div.scrollTop = div.scrollHeight - div.clientHeight;
    }
  }

  handleRoomJoin = (agentId) => {
    this.setState({agentId : agentId})
    let roomId = agentId + this.state.clientId
    console.log(roomId)
    socket.emit('user-connected', roomId)
  }

  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };

  handleMessageSend = () => {
    let roomId = this.state.agentId + this.state.clientId
    const message = {text : this.state.message, date : moment(), senderName : this.state.customerName, tag: 'client'  }
    socket.emit('newmessage',  message , roomId)
  }
  render(){
    return(
      <div className = "row">
        <div className="side-paneel col-md-4">
          
        {
            this.state.agents.map((agent) => {
              return (
                <div className = "card ml-2 p-1 text-success bg-light"
                key = {agent._id}
                  onClick = {() => {this.handleRoomJoin(agent._id)}}
                >
                  {agent.username}
                </div>
              )
            })
          }
        </div>
          <div className = "chat col-md-8">
            <div style = {{maxHeight : '65vh' , overflow : 'auto' , position : 'sticky', bottom  : '0'}} id = "msg_history">
              {
                this.state.messages.map((data) => {
                  if(data.tag == "client" ){
                    return (
                      <div className = 'outgoing_msg'>
                          <div className="sent_msg">
                            <div>
                                {data.senderName}

                            </div>
                            <p>{data.text}</p>
                            <span>{data.date}</span>
                          </div>
                        </div>
                    )
                  }else {
                    return (
                      <div className = 'incoming_msg'>
                          <div className="receive_msg">
                            <div className = "received_withd_msg">
                              <div>
                              {data.senderName}
                              </div>
                                <p>{data.text}</p>
                                <span>{data.date}</span>
                            </div>
                          </div>
                        </div>
                    )
                  }
                })
              }
            </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <TextareaAutosize
                rowsMax={2}
                aria-label="maximum height"
                class="write_msg"
                placeholder="Type a message"
                id="msg"
                style={{ width: "90%" }}
                onChange={(e) => this.handleChange(e)}
              />

              <button
                class="msg_send_btn"
                type="button"
                onClick={this.handleMessageSend}
              >
                <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          </div>
      </div>
    )
  }
}
