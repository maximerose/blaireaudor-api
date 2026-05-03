export const AUTH_UI = {
  LOGIN: {
    TITLE: "Le Blaireau d'Or",
    SUBTITLE: "Identifiez-vous pour entrer dans l'arène",
    SUBMIT: 'Se connecter',
    NO_ACCOUNT: 'Pas encore de compte ?',
    REGISTER_LINK: "S'inscrire ici",
  },

  REGISTER: {
    TITLE: "S'inscrire",
    ALREADY_ACCOUNT: 'Déjà inscrit ?',
    SUBMIT: "S'inscrire",
    LOADING_SUBMIT: 'Inscription en cours...',
  },

  GUEST_ALERT: {
    TITLE: 'Un blaireau existe déjà',
    BELONGS_TO: 'appartient à',
    LAST_COMPETITION: 'Dernier tournoi : ',
    NEW_PLAYER: 'Nouveau joueur',
    USERNAME_PREFIX: 'Le pseudo',
    LINK_BUTTON: "C'est moi, lier ce profil",
  },

  HISTORICAL: {
    LABEL: 'Déjà participé ?',
    ACTION_SELECT: "C'EST MOI",
    CLOSE_SEARCH: 'Je ne suis pas dans cette liste',
  },

  LINKED_CARD: {
    STATUS: 'Profil lié',
    CHANGE_BUTTON: 'Changer',
  },

  LOGOUT: {
    MESSAGE: 'Déconnexion en cours...',
  },
} as const;
