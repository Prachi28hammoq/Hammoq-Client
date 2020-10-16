import React, { Component, Fragment } from "react";
import {useState, useEffect} from 'react'
import $ from "jquery";
//import "./chat.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Axios from "../../services/Axios";
//import { socket } from "../../services/socket";
const io = require("socket.io-client");
const socket = io.connect("http://localhost:8000");



export default function Message(){
    const [agents,setAgent] = useState([])
    const clientId = localStorage.getItem('cid')
  useEffect(()=>{
    Axios.get(`/globalmessage/agent`, {
      headers : {
        'x-access-token' : localStorage.getItem('token')
      }
  }).then((response)=>{
    setAgent(response.data)    
  })
  },[])
 useEffect(()=>{
  socket.on('messages', (data) => {console.log(data)})
 })
  
  
  const handleRoomJoin = (agentId) => {
    let roomId = agentId + clientId
    console.log(roomId)
    socket.emit('user-connected', roomId)
    //socket.on('messages', (data) => {console.log(data)})
  }
 
    return(
      <div className = "row">
        <div className="side-paneel col-md-4">        
        {
            agents.map((agent) => {
              return (
                <div className = "card ml-2 p-1 text-success bg-light"
                  onClick = {() => {handleRoomJoin(agent._id)}}
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
