import React, { Component, Fragment } from "react";
//import { socket } from "../../services/socket";

import $ from "jquery";
//import "./chat.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Axios from "../../services/Axios";
import { socket } from "../../services/socket";

export default class extends Component {
  constructor(){
    super()
    this.state = {
      agents : [],
      clientId : localStorage.getItem('cid')
    }
  }

  componentDidMount = async () => {
    const response = await Axios.get(`/globalmessage/agent`, {
        headers : {
          'x-access-token' : localStorage.getItem('token')
        }
    })
    console.log(response, 'agent value response')
    this.setState({agents : response.data})
  }

  handleRoomJoin = (agentId) => {
    let roomId = agentId + this.state.clientId
    console.log(roomId)
    socket.emit('user-connected', roomId)
    socket.on('messages', (data) => {console.log(data)})
  }
  render(){
  
    return(
      <div className = "row">
        <div className="side-paneel col-md-4">
          
        {
            this.state.agents.map((agent) => {
              return (
                <div className = "card ml-2 p-1 text-success bg-light"
                  onClick = {() => {this.handleRoomJoin(agent._id)}}
                >
                  {agent.username}
                </div>
              )
            })
          }
        </div>
          <div className = "chat col-md-8">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex est excepturi fugiat quod deserunt ipsa dicta illum velit perferendis. Sequi asperiores ipsam eum. Quaerat vero esse perferendis neque consequatur corrupti!</p>
          </div>
      </div>
    )
  }
}
