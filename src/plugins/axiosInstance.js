import axios from 'axios';

const token = localStorage.getItem('token');

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { Authorization: `Bearer ${token}` },
});

// Add a request interceptor
instance.interceptors.request.use((config) => {
  // Do something before request is sent3
  console.log(config);
  return config;
}, (error) => {
  console.log(error);
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  console.log(response);
  return response;
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log(error);
  return Promise.reject(error);
});

export default instance;
