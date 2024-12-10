import axios from "axios";
import { tokenService } from "../utils/token";

const axiosInstance = axios.create({
  baseURL: "https://5th.fe.dev-cos.com:5003",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      tokenService.clearAll();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
