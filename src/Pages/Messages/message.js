import React, { Component, Fragment } from "react";
import { socket } from "../../services/socket";
import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';

import $ from "jquery";
import "./chat.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Axios from "../../services/Axios";
// const io = require("socket.io-client");
// const socket = io.connect("https://devcust.avoidpoints.com");


export default class extends Component {
  constructor(){
    super()
    this.state = {
      clientId : localStorage.getItem('cid'),
      messages : [],
      message: '',
      customerName : localStorage.getItem('customerName'),
       
    }
    socket.on('messages', (data) => {if(data){this.setState({messages : data.messages})}} )
    socket.on('newmessage', (data) => {var messages = this.state.messages 
     messages.push(data.message)
     this.setState({messages : messages})
   })
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
    socket.emit('user-connected', {roomId:this.state.clientId,tag:'client'})
  }

  // componentDidUpdate = () => {
  //      socket.emit('user-connected', this.state.clientId)
  // }

  componentDidUpdate() {
      var div = document.getElementById("msg_history");
      div.scrollTop = div.scrollHeight - div.clientHeight;
  }



  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };

  handleMessageSend = () => {
    let roomId = this.state.clientId
    const message = {text : this.state.message, date : moment(), senderName : this.state.customerName, tag: 'client'  }
    socket.emit('newmessage',  message , roomId)
    this.setState({message : ''})
  }
  render(){
    return(
      <div className="container">
        <div className = "row">
          <div className = "chat col-md-12">
            <div style = {{height : '65vh' , overflow : 'auto' }} id = "msg_history">
              {
                this.state.messages.map((data) => {
                  if(data.tag == "client" ){
                    return (
                      <div className = 'outgoing_msg'>
                          <div className="sent_msg">
                            <div >
                                {data.senderName}

                            </div>
                            <p>{data.text}</p>
                            <span className = 'time_date'>{moment(data.date).format('ll')}</span>
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
                                <span className = 'time_date'>{moment(data.date).format('ll')}</span>
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
                value = {this.state.message}
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
      </div>
      
    )
  }
}
