import socketIOClient from "socket.io-client";

let socket = socketIOClient("https://devcust.avoidpoints.com", {transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },});

if(process.env.REACT_APP_STAGE === 'devlocal')
{
	const socket = socketIOClient("http://localhost:8000/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

else if(process.env.REACT_APP_STAGE === 'devhost')
{
	const socket = socketIOClient("https://devcust.avoidpoints.com", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

else if(process.env.REACT_APP_STAGE === 'staging')
{
	const socket = socketIOClient("https://stageapp.avoidpoints.com", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

else if(process.env.REACT_APP_STAGE === 'production')
{
	const socket = socketIOClient("https://app.hammoq.com", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

module.exports.socket = socket