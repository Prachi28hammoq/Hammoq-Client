import React, { Component } from "react";
import moment from 'moment'
import "./chat.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { messageSocket } from "../../../src/services/socket.jsx";

//let socket = require.main.exports.socket;

class message extends Component {
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
                  if(data.tag === "client" ){
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
          <div className="type_msg">
            <div className="input_msg_write">
              <TextareaAutosize
                rowsMax={2}
                aria-label="maximum height"
                className="write_msg"
                placeholder="Type a message"
                value = {this.state.message}
                id="msg"
                style={{ width: "90%" }}
                onChange={(e) => this.handleChange(e)}
              />

              <button
                className="msg_send_btn"
                type="button"
                onClick={this.handleMessageSend}
              >
                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          </div>
      </div>
      </div>
      
    )
  }
}
export default message;