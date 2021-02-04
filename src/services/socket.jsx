import socketIOClient from "socket.io-client";

var socket = socketIOClient("https://app.hammoq.com/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});

if(process.env.REACT_APP_STAGE === 'devlocal')
{
	socket = socketIOClient("http://localhost:8000/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

else if(process.env.REACT_APP_STAGE === 'devhost')
{
	socket = socketIOClient("https://devcust.avoidpoints.com/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

else if(process.env.REACT_APP_STAGE === 'staging')
{
	socket = socketIOClient("https://stageapp.avoidpoints.com/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

else if(process.env.REACT_APP_STAGE === 'production')
{
	socket = socketIOClient("https://app.hammoq.com/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

export default socket;