import socketIOClient from "socket.io-client";

var serverURL = "";

serverURL = "http://localhost:8000/";

let socket = socketIOClient(serverURL,
	{
		transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});

export default socket;