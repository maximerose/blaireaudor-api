import { API, ERRORS } from '@/constants';
import { apiFetch } from '@/services';

export const resetPasswordService = {
  /**
   * Étape 1 : Demande l'envoi d'un mail de réinitialisation
   */
  requestReset: async (email: string) => {
    const response = await apiFetch(API.ENDPOINTS.AUTH.RESET_PASSWORD_REQUEST, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  /**
   * Étape 2 : Valide si le jeton du lien reçu par mail est encore valide
   */
  validateToken: async (token: string) => {
    const response = await apiFetch(
      API.ENDPOINTS.AUTH.RESET_PASSWORD_VALIDATE(token),
      { method: 'GET' },
    );
    if (!response.ok) throw new Error(ERRORS.AUTH.INVALID_TOKEN);
    return true;
  },

  /**
   * Étape 3 : Soumet le nouveau mot de passe définitif
   */
  reset: async (token: string, plainPassword: string) => {
    const response = await apiFetch(
      API.ENDPOINTS.AUTH.RESET_PASSWORD_RESET(token),
      {
        method: 'POST',
        body: JSON.stringify({ plain_password: plainPassword }),
      },
    );

    if (!response.ok) {
      const err = await response.json();
      throw err;
    }

    return response.json();
  },
};
