import Axios from "axios";

const baseURL = "https://app.hammoq.com/api";
const assetsURL = "https://app.hammoq.com/assets/";

// const baseURL = "http://stageapp.avoidpoints.com/api";
// const assetsURL = "http://stageapp.avoidpoints.com/assets/";

// const baseURL = "http://localhost:8000/api";
// const assetsURL = "http://localhost:8000/assets/";

// const baseURL = "https://devcust.avoidpoints.com/api";
// const assetsURL = "https://devcust.avoidpoints.com/assets/";


//const socketCon = "http://localhost:8000";

Axios.defaults.baseURL = baseURL + "/client";

export default Axios;
export { baseURL, assetsURL };
