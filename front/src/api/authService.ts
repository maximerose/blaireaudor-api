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

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
    }

    return { ok: response.ok, data };
  },

  /**
   * Identifie l'utilisateur et stocke le Token JWT
   */
  login: async (credentials: any) => {
    const response = await apiFetch('/login', {
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
    try {
      await apiFetch('/logout', {
        method: 'GET',
      });
    } catch (error) {
      console.error(
        'Erreur lors de la notification de déconnexion au serveur',
        error,
      );
    } finally {
      localStorage.removeItem('token');
    }
  },

  /**
   * Récupère le token stocké
   */
  getToken: () => localStorage.getItem('token'),

  /**
   * Vérifie si un nom d'utilisateur est déjà pris
   */
  checkUsername: async (username: string) => {
    const response = await apiFetch(`/check-username/${username}`);
    return await response.json();
  },
};
