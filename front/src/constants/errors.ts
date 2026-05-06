export const ERRORS = {
  // 1. Erreurs techniques / Réseau
  NETWORK: {
    GENERIC: 'Une erreur est survenue.',
    SERVER: '📡 Erreur de connexion au serveur.',
    TIMEOUT: 'Le serveur met trop de temps à répondre.',
    UNEXPECTED: "Une erreur inattendue s'est produite.",
  },

  SYMFONY_DETAILS: "Détails de l'erreur Symfony : ",

  // 2. Erreurs d'Authentification / Inscription
  AUTH: {
    INVALID_CREDENTIALS: 'Identifiants invalides.',
    SESSION_EXPIRED: 'Votre session a expiré, merci de vous reconnecter.',
    UNAUTHORIZED: "Vous n'avez pas les droits pour accéder à cette arène.",
    REGISTRATION_FAILED: "L'inscription a échoué. Vérifiez vos informations.",
    FORBIDDEN: "Action interdite : vous n'êtes pas administrateur.",
  },

  // 3. Compétitions / Arènes
  COMPETITION: {
    NOT_FOUND: (code: string) =>
      `La compétition avec le code "${code}" est introuvable.`,
    FETCH_LEADERBOARD: 'Impossible de charger le classement pour le moment.',
    FETCH_ACTIONS:
      "Erreur lors de la récupération de l'historique des actions.",
    CREATE_FAILED:
      'Impossible de créer la compétition. Vérifiez les dates et le code.',
    UPDATE_FAILED: 'Échec de la mise à jour des paramètres de la compétition.',
    DELETE_FAILED: 'La suppression de la compétition a échoué.',
    PARTICIPATION_ADD_FAILED:
      "Une erreur est survenue lors de l'ajout des participants.",
    PARTICIPATION_REMOVE_FAILED:
      'Impossible de retirer le joueur de la compétition',
    REFEREE_ADD_FAILED: 'Impossible de nommer ce joueur arbitre.',
    REFEREE_REMOVE_FAILED: "Erreur lors de la destitution de l'arbitre.",
  },

  // 4. Joueurs & Arbitres
  PLAYER: {
    SEARCH_FAILED: 'La recherche de joueurs a échoué.',
    SEARCH_TOO_SHORT:
      'Veuillez saisir au moins 2 caractères pour la recherche.',
  },

  // 5. Formulaires & Validation
  VALIDATION: {
    REQUIRED: 'Ce champ est obligatoire.',
    INVALID_DATE_RANGE:
      'La date de fin doit être postérieure à la date de début.',
    INVALID_FORMAT: 'Format de données invalide.',
  },

  DEVELOPER: {
    HOOK_OUTSIDE_PROVIDER: (hookName: string, providerName: string) =>
      `${hookName} must be used within an ${providerName}`,
  },
} as const;
