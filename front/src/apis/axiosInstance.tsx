import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://5th.fe.dev-cos.com:5003',
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰이 필요한 경우
    const token = sessionStorage.getItem('token');
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
    // 401 에러 처리 (토큰 만료 등)
    if (error.response?.status === 401) {
      // 로그아웃 처리 또는 토큰 갱신 로직
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
