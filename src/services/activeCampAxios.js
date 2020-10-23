import Axios from "axios";

const baseURL = "https://hammoq.api-us1.com/api/3/";

// Axios.defaults.baseURL = baseURL;
// if ('token' in localStorage) {
//     Axios.defaults.headers.common["Api-Token"] = "5732d521ee46f4a7bf5397e9fb4228156b29b5cb9a8198c96dddf21d75f8edecc5311ce2";
// }

const acAxios = Axios.create({
    baseURL: baseURL,
    headers: {'Api-Token': "5732d521ee46f4a7bf5397e9fb4228156b29b5cb9a8198c96dddf21d75f8edecc5311ce2"}
});

export default acAxios;
