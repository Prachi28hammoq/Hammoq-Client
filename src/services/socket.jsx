import socketIOClient from "socket.io-client";

let socket = socketIOClient("http://localhost:8000/", {
	transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
});

export default socket;