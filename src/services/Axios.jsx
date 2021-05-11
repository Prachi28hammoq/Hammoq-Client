import Axios from "axios";
import {Redirect} from "react-router-dom";

var baseURL = "http://localhost:8000/api";
var assetsURL = "https://hammoq-assets.storage.googleapis.com/assets/";
var assetsThumbnailURL = "https://hammoq-assets.storage.googleapis.com/assetsThumbnail/";

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

if ('token' in localStorage) 
{
    Axios.defaults.headers["x-access-token"] = `bearer ${localStorage.getItem("token")}`;
}

if(process.env.REACT_APP_STAGE !== 'devlocal')
{
	Axios.defaults.withCredentials = true
}

Axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
  	if(error && error.response && error.response.data && error.response.data.message === 'Invalid Token.') 
  		{	
  			localStorage.removeItem("token");
			<Redirect to="signin" />
  		}
    return Promise.reject(error);
  });

export default Axios;
export { baseURL, assetsURL, assetsThumbnailURL };
