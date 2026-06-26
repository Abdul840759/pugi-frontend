import axios from 'axios';
import { storage } from '@/utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

adminApi.interceptors.request.use((config) => {
  const token = storage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const adminToken = storage.getAdminToken();
  if (adminToken) {
    config.headers['x-admin-token'] = adminToken;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAdminToken();
    }
    return Promise.reject(error);
  },
);
