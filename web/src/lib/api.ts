import axios from 'axios';
import { showToast } from '@/lib/toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/v1`,
});

api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('api_key');
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('api_key');
      localStorage.removeItem('user_id');
      showToast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
      window.location.href = '/';
    } else if (error.response?.status === 500) {
      showToast('Lỗi máy chủ, vui lòng thử lại sau', 'error');
    }
    return Promise.reject(error);
  },
);

export function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  const apiKey = localStorage.getItem('api_key');
  if (apiKey) headers.set('x-api-key', apiKey);
  return fetch(`${API_URL}/v1${path}`, { ...init, headers });
}
