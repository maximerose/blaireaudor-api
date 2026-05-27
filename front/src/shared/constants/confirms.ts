export const CONFIRMS = {
  COMPETITION: {
    CLOSE_TITLE: 'Terminer la compétition maintenant ?',
    CLOSE_MESSAGE: (fogOfWar: boolean) =>
      `Le classement sera gelé et plus aucun signalement ne sera possible.${fogOfWar ? ' Le brouillard de guerre sera désactivé, tous les joueurs pourront voir les scores !' : ''}`,
    DELETE_TITLE: 'Supprimer la compétition',
    DELETE_MESSAGE: (name: string) => `Supprimer définitivement "${name}" ?`,
  },

  PARTICIPATION: {
    REMOVE_TITLE: 'Retirer un joueur',
    REMOVE_MESSAGE: (name: string) => `Retirer ${name} de cette compétition ?`,
  },

  REFEREE: {
    RESIGN_TITLE: 'Démissionner',
    REVOKE_TITLE: 'Révoquer un arbitre',
    RESIGN_MESSAGE: "Es-tu sûr de vouloir démissionner de l'arbitrage ?",
    REVOKE_MESSAGE: (name: string) =>
      `Veux-tu vraiment révoquer les droits de ${name} ?`,
  },
} as const;
