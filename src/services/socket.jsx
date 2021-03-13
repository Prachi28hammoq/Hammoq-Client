import socketIOClient from "socket.io-client";

var serverURL = "";

if(process.env.REACT_APP_STAGE === 'devhost')
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

let socket = socketIOClient(serverURL, {path: '/chat/'},
{
  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
});

if(process.env.REACT_APP_STAGE === 'devlocal')
{
    let url = "http://localhost:8000/";
    socket = socketIOClient(url, {
    transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
    });
}


export default socket;