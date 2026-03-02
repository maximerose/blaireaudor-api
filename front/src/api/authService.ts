import { apiFetch } from './config';

export const authService = {
  /**
   * Envoie les données d'inscription au backend
   */
  register: async (formData: any) => {
    const response = await apiFetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return { ok: response.ok, data };
  },

  /**
   * Vérifie si un nom d'utilisateur est déjà pris
   */
  checkUsername: async (username: string) => {
    const response = await apiFetch(`/check-username/${username}`);
    return await response.json();
  },
};
