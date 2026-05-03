import { API } from '@/constants';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers = new Headers(options.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', API.GROUPS.JSON_LD);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', API.GROUPS.JSON_LD);
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API.BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};
