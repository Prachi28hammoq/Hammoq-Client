import socketIOClient from "socket.io-client";

var serverURL = "";
let socket = undefined;

if(process.env.REACT_APP_STAGE === 'devlocal')
{
    let url = "http://localhost:8000/";
    socket = socketIOClient(url, {transports: [ "websocket", "polling" ]});
}

else if(process.env.REACT_APP_STAGE === 'devhost')
{
	serverURL = "https://devapi.hammoq.com/";
}

else if(process.env.REACT_APP_STAGE === 'staging')
{
	serverURL = "https://stageapi.hammoq.com/";
}

else if(process.env.REACT_APP_STAGE === 'production')
{
	serverURL = "https://api.hammoq.com/";
}

if(process.env.REACT_APP_STAGE !== 'devlocal')
{
	socket = socketIOClient(serverURL, {transports: ["websocket"]});
}

export default socket;
