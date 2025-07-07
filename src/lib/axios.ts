// lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // You can set a base URL if you're using APIs in Next.js
});

export default axiosInstance;
