import socketIOClient from "socket.io-client";

var serverURL = "";
let socket = undefined;

serverURL = "http://localhost:8000/";

socket = socketIOClient(serverURL, {transports: ["websocket"], withCredentials: true});

export default socket;
