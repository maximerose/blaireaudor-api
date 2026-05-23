export const SUCCESS = {
  AUTH: {
    LOGIN: 'Connexion réussie !',
    REGISTER: 'Inscription validée !',
    INFO_UPDATED: 'Informations mises à jour !',
    PASSWORD_UPDATED: 'Mot de passe modifié !',
  },

  COMPETITION: {
    CREATED: 'Compétition créée !',
    DELETED: 'Compétition supprimée !',
    UPDATED: 'Compétition modifiée !',
    PARTICIPANTS_UPDATED: 'Participants mis à jour !',
  },

  ACTION: {
    REPORTED_ADMIN: 'Action enregistrée !',
    REPORTED_USER: "Dénonciation transmise à l'arbitre !",
    STATUS_UPDATED: 'Action mise à jour !',
  },

  BONUS: {
    ADDED: 'Multiplicateur ajouté !',
    DELETED: 'Multiplicateur supprimé !',
  },

  REFEREE: {
    ADDED: (name: string) => `${name} est désormais arbitre !`,
    REVOKED: (name: string) => `${name} a été révoqué !`,
    RESIGNED: "Tu n'es plus arbitre !",
  },
} as const;
