export const SUCCESS = {
  AUTH: {
    LOGIN: 'Connexion réussie !',
    REGISTER: 'Inscription validée, bienvenue !',
    INFO_UPDATED: 'Informations mises à jour avec succès !',
    PASSWORD_UPDATED: 'Mot de passe modifié avec succès !',
  },

  COMPETITION: {
    CREATED: 'La compétition a été créée avec succès.',
    UPDATED: 'La compétition a été modifiée avec succès.',
    PARTICIPANTS_UPDATED: 'Liste des participants mise à jour !',
  },

  ACTION: {
    REPORTED_ADMIN: 'Méfait enregistré !',
    REPORTED_USER: "Dénonciation transmise à l'arbitre.",
    STATUS_UPDATED: "Le statut de l'action a été mis à jour.",
  },

  BONUS: {
    ADDED: 'Jour multiplicateur ajouté !',
    DELETED: 'Bonus supprimé avec succès.',
  },

  REFEREE: {
    ADDED: (name: string) => `${name} est désormais arbitre.`,
    REVOKED: (name: string) => `${name} a été révoqué.`,
    RESIGNED: "Vous avez quitté l'arbitrage.",
  },
} as const;
