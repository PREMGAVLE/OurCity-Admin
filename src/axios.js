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

// Add response interceptor to handle errors gracefully
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 404 errors gracefully without showing popups
    if (error.response && error.response.status === 404) {
      console.warn("API endpoint not found:", error.config.url);
      // Return a resolved promise with empty data to prevent unhandled rejections
      return Promise.resolve({ data: null, status: 404 });
    }
    
    // Handle other errors
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default instance;
