export const FORM = {
  LABELS: {
    USERNAME: "Nom d'utilisateur",
    PASSWORD: 'Mot de passe',
    DISPLAY_NAME: "Nom d'affichage",
    EMAIL: 'Adresse email',
    NEW_PASSWORD: 'Nouveau mot de passe',
    CONFIRM_PASSWORD: 'Confirmer le mot de passe',
  },

  PLACEHOLDERS: {
    USERNAME: 'votre-pseudo',
    PASSWORD: '••••••••',
    DISPLAY_NAME: 'Ex: Jean Dupont',
    EMAIL: 'blaireau@or.com',
    SEARCH_PLAYER: 'Rechercher un blaireau...',
  },

  HINTS: {
    USERNAME_HINT: 'Minuscules, chiffres et tirets uniquement',
    USERNAME_CHECK: 'Vérification en cours...',
    USERNAME_AVAILABLE: 'Pseudo disponible !',
    USERNAME_TAKEN: 'Ce pseudo est déjà pris.',
  },

  VALIDATION: {
    REQUIRED: 'Ce champ est obligatoire.',
    EMAIL_INVALID: "Format d'email incorrect.",
  },
} as const;
