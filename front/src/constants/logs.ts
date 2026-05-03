export const LOG_MESSAGES = {
  AUTH: {
    INIT_FAILED: "[AUTH_SERVICE] Échec de l'initialisation de la session",
    REFRESH_FAILED:
      '[AUTH_SERVICE] Impossible de rafraîchir les données utilisateur',
    LOGOUT_SERVER_ERROR:
      '[AUTH_SERVICE] Erreur lors de la déconnexion côté serveur',
  },
  API: {
    FETCH_ERROR: '[API_SERVICE] Erreur lors de la récupération des données',
  },
} as const;
