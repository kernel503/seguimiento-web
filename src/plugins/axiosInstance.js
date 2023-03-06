import axios from 'axios';

const token = localStorage.getItem('token');

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { Authorization: `Bearer ${token}` },
});

export default instance;
