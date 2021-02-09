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
	baseURL = "https://devapi.hammoq.com/api";
	assetsURL = "https://devapi.hammoq.com/assets/";
}

else if(process.env.REACT_APP_STAGE === 'staging')
{
	baseURL = "https://stageapi.hammoq.com/api";
	assetsURL = "https://stageapi.hammoq.com/assets/";
}

else if(process.env.REACT_APP_STAGE === 'production')
{
	baseURL = "https://api.hammoq.com/api";
	assetsURL = "https://api.hammoq.com/assets/";
}

Axios.defaults.baseURL = baseURL + "/client";

export default Axios;
export { baseURL, assetsURL };
