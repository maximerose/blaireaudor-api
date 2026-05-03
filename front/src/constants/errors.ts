// front/src/constants/errors.ts

export const ERRORS = {
  // 1. Erreurs techniques / Réseau
  NETWORK: {
    GENERIC: 'Une erreur est survenue.',
    SERVER: '📡 Erreur de connexion au serveur.',
    TIMEOUT: 'Le serveur met trop de temps à répondre.',
    UNEXPECTED: "Une erreur inattendue s'est produite.",
  },

  // 2. Erreurs d'Authentification / Inscription
  AUTH: {
    INVALID_CREDENTIALS: 'Identifiants invalides.',
    SESSION_EXPIRED: 'Votre session a expiré, merci de vous reconnecter.',
    UNAUTHORIZED: "Vous n'avez pas les droits pour accéder à cette arène.",
    REGISTRATION_FAILED: "L'inscription a échoué. Vérifiez vos informations.",
  },

  DEVELOPER: {
    HOOK_OUTSIDE_PROVIDER: (hookName: string, providerName: string) =>
      `${hookName} must be used within an ${providerName}`,
  },
} as const;
