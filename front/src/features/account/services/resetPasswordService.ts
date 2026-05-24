import { API, apiFetch } from '@/shared';

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
    await apiFetch(API.ENDPOINTS.AUTH.RESET_PASSWORD_VALIDATE(token), {
      method: 'GET',
    });

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

    return response.json();
  },
};
