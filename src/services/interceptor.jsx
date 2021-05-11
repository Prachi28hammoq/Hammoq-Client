import Axios from './Axios';

export default {
  setupInterceptors: (history) => {

      Axios.interceptors.response.use((response) => {
        return response;
      }, 
      (error) => 
      {
        if(error && error.response && error.response.data && error.response.data.message === 'Invalid Token.') 
        { 
          localStorage.removeItem("token");
          history.push('/signin');
        }

        return Promise.reject(error);
    });
  },
};