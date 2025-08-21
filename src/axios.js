import axios from "axios";
//  const API_BASE_URL = "https://api.learn2ern.com/api/";
//////////////////////
//  const API_BASE_URL = "https://learn2earn-alpha.vercel.app/";
//////////////////////
 const API_BASE_URL = "https://burhanpur-city-backend-mfs4.onrender.com/api";

const instance = axios.create({
  baseURL:API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // console.log(token)
    // console.log("token")
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  }
);

export default instance;
