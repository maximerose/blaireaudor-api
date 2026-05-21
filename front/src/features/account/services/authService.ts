import { API, apiFetch } from '@/shared';
import type {
  AuthResult,
  LoginCredentials,
  RegisterData,
  User,
} from '@/features/account/types';

export const authService = {
  register: async (formData: RegisterData): Promise<AuthResult> => {
    const response = await apiFetch(API.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.token) localStorage.setItem('token', data.token);
    return { ok: true, data };
  },

  login: async (credentials: LoginCredentials): Promise<AuthResult> => {
    const response = await apiFetch(API.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.token) localStorage.setItem('token', data.token);
    return { ok: true, data };
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await apiFetch(API.ENDPOINTS.AUTH.LOGOUT, { method: 'GET' });
    } finally {
      localStorage.removeItem('token');
    }
  },

  me: async (): Promise<User | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const response = await apiFetch(API.ENDPOINTS.AUTH.ME, { method: 'GET' });
      return await response.json();
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  },

  isLoggedIn: () => !!localStorage.getItem('token'),
  getToken: () => localStorage.getItem('token'),
};
