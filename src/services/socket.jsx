import socketIOClient from "socket.io-client";

var serverURL = "";

if(process.env.REACT_APP_STAGE === 'devlocal')
{
	serverURL = "http://localhost:8000/";
}

else if(process.env.REACT_APP_STAGE === 'devhost')
{
	serverURL = "https://devapi.avoidpoints.com/";
}

else if(process.env.REACT_APP_STAGE === 'staging')
{
	serverURL = "https://stageapi.avoidpoints.com/";
}

else if(process.env.REACT_APP_STAGE === 'production')
{
	serverURL = "https://api.hammoq.com/";
}

let socket = socketIOClient(serverURL, 
{
  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
});

export default socket;