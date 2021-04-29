import Axios from "axios";

var baseURL = "http://localhost:8000/api";
var assetsURL = "https://hammoq-assets.storage.googleapis.com/assets/";

Axios.defaults.baseURL = baseURL + "/client";

if ('token' in localStorage) 
{
    Axios.defaults.headers["x-access-token"] = `bearer ${localStorage.getItem("token")}`;
}

export default Axios;
export { baseURL, assetsURL };
