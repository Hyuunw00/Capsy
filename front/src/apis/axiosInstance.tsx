import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://5th.fe.dev-cos.com:5001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;