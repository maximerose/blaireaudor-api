import { API, ERRORS, LOG_MESSAGES } from '@/constants';
import { apiFetch } from '@/services';
import type { AuthResult, LoginCredentials, RegisterData, User } from '@/types';

export const authService = {
  /**
   * Envoie les données d'inscription au backend
   */
  register: async (formData: RegisterData): Promise<AuthResult> => {
    const response = await apiFetch(API.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
    }

    return { ok: response.ok, data };
  },

  /**
   * Identifie l'utilisateur et stocke le Token JWT
   */
  login: async (credentials: LoginCredentials): Promise<AuthResult> => {
    const response = await apiFetch(API.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
    }

    return { ok: response.ok, data };
  },

  /**
   * Déconnexion : Nettoie le stockage local
   */
  logout: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await apiFetch(API.ENDPOINTS.AUTH.LOGOUT, {
        method: 'GET',
      });
    } catch (error) {
      console.error(LOG_MESSAGES.AUTH.LOGOUT_FAILED, error);
    } finally {
      localStorage.removeItem('token');
    }
  },

  /**
   * Récupère les informations de l'utilisateur connecté via le Token
   */
  me: async (): Promise<User | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await apiFetch(API.ENDPOINTS.AUTH.ME, { method: 'GET' });

      if (!response.ok) {
        localStorage.removeItem('token');
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(LOG_MESSAGES.AUTH.FETCH_USER_FAILED, error);
      localStorage.removeItem('token');
      return null;
    }
  },

  updateProfile: async (data: Record<string, string>) => {
    const response = await apiFetch(API.ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    if (result.token) {
      localStorage.setItem('token', result.token);
    }

    return result.user;
  },

  /**
   * Vérification rapide de la connexion
   */
  isLoggedIn: () => !!localStorage.getItem('token'),

  /**
   * Récupère le token stocké
   */
  getToken: () => localStorage.getItem('token'),

  /**
   * Vérifie si un nom d'utilisateur est déjà pris
   */
  checkUsername: async (username: string, signal?: AbortSignal) => {
    const response = await apiFetch(
      API.ENDPOINTS.USER.CHECK_USERNAME(username),
      { signal },
    );
    return await response.json();
  },

  /**
   * Vérifie si un email est déjà pris
   */
  checkEmail: async (email: string, signal?: AbortSignal) => {
    const response = await apiFetch(API.ENDPOINTS.USER.CHECK_EMAIL(email), {
      signal,
    });
    return await response.json();
  },

  requestPasswordReset: async (email: string) => {
    const response = await apiFetch(API.ENDPOINTS.AUTH.RESET_PASSWORD_REQUEST, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  validateResetToken: async (token: string) => {
    const response = await apiFetch(
      API.ENDPOINTS.AUTH.RESET_PASSWORD_VALIDATE(token),
      {
        method: 'GET',
      },
    );
    if (!response.ok) throw new Error(ERRORS.AUTH.INVALID_TOKEN);
    return true;
  },

  resetPassword: async (token: string, plain_password: string) => {
    const response = await apiFetch(
      API.ENDPOINTS.AUTH.RESET_PASSWORD_RESET(token),
      {
        method: 'POST',
        body: JSON.stringify({ plain_password }),
      },
    );

    if (!response.ok) {
      const err = await response.json();
      throw err;
    }

    return response.json();
  },
};
