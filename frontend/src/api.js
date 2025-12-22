import axios from 'axios';
const API_BASE=import.meta.env.VITE_API_BASE||'http://localhost:4000';
const a=axios.create({baseURL:API_BASE});
a.interceptors.request.use(c=>{const t=localStorage.getItem('token');if(t)c.headers.Authorization='Bearer '+t;return c;});
export default a;
export {API_BASE};