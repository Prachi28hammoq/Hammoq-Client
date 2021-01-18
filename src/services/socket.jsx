import socketIOClient from "socket.io-client";

if(process.env.REACT_APP_STAGE === 'devlocal')
{
	module.exports.socket = socketIOClient("http://localhost:8000/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

else if(process.env.REACT_APP_STAGE === 'devhost')
{
	module.exports.socket = socketIOClient("https://devcust.avoidpoints.com/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

else if(process.env.REACT_APP_STAGE === 'staging')
{
	module.exports.socket = socketIOClient("https://stageapp.avoidpoints.com/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}

else if(process.env.REACT_APP_STAGE === 'production')
{
	module.exports.socket = socketIOClient("https://app.hammoq.com/", 
	{
	  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
	});
}