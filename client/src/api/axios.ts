import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SESSION_MESSAGE_KEY = 'authMessage';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register'];

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? '';
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

    if (error.response?.status === 401 && !isAuthEndpoint) {
      store.dispatch(logout());
      sessionStorage.setItem(SESSION_MESSAGE_KEY, 'sessionExpired');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
