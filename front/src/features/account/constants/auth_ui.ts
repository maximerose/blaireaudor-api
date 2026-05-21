export const AUTH_UI = {
  LOGIN: {
    TITLE: 'Se connecter',
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
    ARIA_LINK: (name: string) =>
      `Lier le profil existant de ${name} à mon compte`,
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

  FORGOT_PASSWORD: {
    TITLE: 'Mot de passe oublié',
    SUBTITLE: 'Saisis ton email pour recevoir un lien de réinitialisation.',
    SUBMIT: 'Envoyer le lien',
    SUCCESS: 'Si un compte correspond, un email a été envoyé !',
    BACK_TO_LOGIN: 'Retour à la connexion',
  },

  RESET_PASSWORD: {
    TITLE: 'Nouveau mot de passe',
    SUBTITLE: "Choisis un mot de passe robuste pour ton retour dans l'arène.",
    SUBMIT: 'Sauvegarder',
    SUCCESS: 'Mot de passe mis à jour ! Tu peux te connecter.',
    INVALID_TOKEN: 'Ce lien est invalide ou a expiré.',
    VALIDATE_LINK: 'Vérification du lien...',
  },
} as const;
