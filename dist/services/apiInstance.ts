import axios from "axios";
import config from "../renderer/utils/config";
const coreApi = axios.create({
  baseURL: config.BASE_URL,
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
