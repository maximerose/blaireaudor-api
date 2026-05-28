import { API, apiFetch } from '@/shared';

export const userService = {
  /**
   * Modifie les informations ou le mot de passe du profil connecté
   */
  updateProfile: async <T extends Record<string, unknown>>(data: T) => {
    const response = await apiFetch(API.ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: 'PATCH',
      headers: { 'Content-Type': API.GROUPS.MERGE_PATCH },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.token) {
      localStorage.setItem('token', result.token);
    }

    return result.user;
  },

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
};
