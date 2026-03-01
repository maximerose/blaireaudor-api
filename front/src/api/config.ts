export const API_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
