import { ICONS } from './icons';

export const CONFIRMS = {
  COMPETITION: {
    CLOSE_TITLE: `${ICONS.FLAG} Terminer la compétition maintenant ?`,
    CLOSE_MESSAGE: `Le classement sera gelé et plus aucun signalement ne sera possible.`,
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
