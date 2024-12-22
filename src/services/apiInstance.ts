import axios from "axios";

const coreApi = axios.create({
 // baseURL: process.env.NODE_ENV === "production" ? "https://api.example.com" : "/", 
  baseURL: "/",
});

coreApi.interceptors.request.use(
  (config) => {
    const authToken = `Bearer ${localStorage.getItem("access_token")}`;
    if (authToken) {
      config.headers.Authorization = authToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { coreApi };