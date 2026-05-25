export const LOG_MESSAGES = {
  AUTH: {
    INIT_FAILED: "[AUTH_SERVICE] Échec de l'initialisation de la session",
    REFRESH_FAILED:
      '[AUTH_SERVICE] Impossible de rafraîchir les données utilisateur',
    LOGOUT_FAILED: '[AUTH_SERVICE] Erreur lors de la déconnexion côté serveur',
    REGISTRATION_FAILED: "[AUTH_SERVICE] Erreur d'inscription :",
    FETCH_USER_FAILED:
      '[AUTH_SERVICE] Erreur lors de la récupération du profil utilisateur',
  },
  API: {
    FETCH_ERROR: '[API_SERVICE] Erreur lors de la récupération des données',
  },
  COMPETITION: {
    CREATE_FAILED:
      '[COMPETITION_SERVICE] Échec de la création de la compétition :',
  },
  ACTION: {
    UPDATE_FAILED:
      "[ACTION_SERVICE] Erreur lors de la mise à jour de l'action :",
    STATUS_UPDATE_FAILED:
      '[ACTION_SERVICE] Erreur lors du changement de statut :',
  },
  UTILS: {
    DATE_PARSING_FAILED: '[UTILS] Échec du parsing de la date :',
  },
  SUBSCRIPTION: {
    MISSING_KEY:
      '[PUSH_SUBSCRIPTION_SERVICE] VITE_VAPID_PUBLIC_KEY manquante dans .env.local',
    FAILED:
      '[PUSH_SUBSCRIPTION_SERVICE] Erreur lors de la souscription Web Push:',
  },
} as const;
