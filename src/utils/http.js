// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCookies, removeCookies } from './cookieToken';

// const navigate = useNavigate();

// instantiate axios
const http = axios.create({
  baseURL: import.meta.env.APP_URL_API,
  timeout: 10000,
});

// request interceptor
http.interceptors.request.use(
  (config) => {
    const token = getCookies('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
http.interceptors.response.use(
  // status code 200
  (response) => response,
  // status code not equal to 200
  (error) => {
    if (error.response.data.error_code === 'AUTH-002') {
      removeCookies('authToken');
      window.location.href = '/';
      return;
    }
    return Promise.reject(error);
  }
);

export { http };
