import Axios from "axios";

var baseURL = "";
var assetsURL = "";

if(process.env.REACT_APP_STAGE === 'devlocal')
{
	baseURL = "http://localhost:8000/api";
	assetsURL = "http://localhost:8000/assets/";
}

else if(process.env.REACT_APP_STAGE === 'devhost')
{
	baseURL = "https://devcust.avoidpoints.com/api";
	assetsURL = "https://devcust.avoidpoints.com/assets/";
}

else if(process.env.REACT_APP_STAGE === 'staging')
{
	baseURL = "https://stageapp.avoidpoints.com/api";
	assetsURL = "https://stageapp.avoidpoints.com/assets/";
}

else if(process.env.REACT_APP_STAGE === 'production')
{
	baseURL = "https://app.hammoq.com/api";
	assetsURL = "https://app.hammoq.com/assets/";
}

Axios.defaults.baseURL = baseURL + "/client";

/*if ('token' in localStorage) {
    Axios.defaults.headers.common["x-access-token"] = localStorage.getItem("token");
}*/

export default Axios;
export { baseURL, assetsURL };
