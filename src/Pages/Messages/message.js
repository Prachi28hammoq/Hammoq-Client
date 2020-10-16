import React , {useState, useEffect}from "react";
import $ from "jquery";
//import "./chat.css";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Axios from "../../services/Axios";
//import { socket } from "../../services/socket";
const io = require("socket.io-client");
const socket = io.connect("http://localhost:8000");


const  Message = () => {
  const [agents , setAgents] = useState([])

  useEffect(() => {
    loadAgent();
  },[])

  loadAgent = async() => {
    const response = await Axios.get('/globalMessage/agent',{
      headers : {
        'x-access-token' : localStorage.getItem('token')
      }
    })
    console.log(response, 'sers gjhgjg')
    setAgents(response.data)
  }
  return(
    <div>
      <h1>helllooo</h1>
    </div>
  )
}

export default Message