import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://foodhub.sbs';
console.log('🔗 API Base URL:', API_BASE);

const a = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
a.interceptors.request.use(c => {
  const t = localStorage.getItem('token');
  if(t) c.headers.Authorization = 'Bearer ' + t;
  console.log('📤 Request:', c.method.toUpperCase(), c.baseURL + c.url);
  return c;
}, err => {
  console.error('❌ Request error:', err);
  return Promise.reject(err);
});

// Response interceptor
a.interceptors.response.use(
  res => {
    console.log('📥 Response:', res.status, res.config.url);
    return res;
  },
  err => {
    console.error('❌ Response error:', err.message, err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

export default a;
export { API_BASE };