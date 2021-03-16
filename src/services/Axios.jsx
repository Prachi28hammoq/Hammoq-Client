import Axios from "axios";

var baseURL = "";
var assetsURL = "https://hammoq-assets.storage.googleapis.com/assets/";

if(process.env.REACT_APP_STAGE === 'devlocal')
{
	baseURL = "http://localhost:8000/api";
}

else if(process.env.REACT_APP_STAGE === 'devhost')
{
	baseURL = "https://devapi.hammoq.com/api";
}

else if(process.env.REACT_APP_STAGE === 'staging')
{
	baseURL = "https://stageapi.hammoq.com/api";
}

else if(process.env.REACT_APP_STAGE === 'production')
{
	baseURL = "https://api.hammoq.com/api";
}

Axios.defaults.baseURL = baseURL + "/client";

export default Axios;
export { baseURL, assetsURL };
