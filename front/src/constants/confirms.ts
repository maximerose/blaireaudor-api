import { ICONS } from './icons';

export const CONFIRMS = {
  COMPETITION: {
    CLOSE: `${ICONS.FLAG} CONFIRMATION : Terminer la compétition maintenant ? Le classement sera gelé et plus aucun signalement ne sera possible.`,
    DELETE_TITLE: 'Supprimer la compétition',
    DELETE_MESSAGE: (name: string) => `Supprimer définitivement "${name}" ?`,
  },

  PARTICIPATION: {
    REMOVE_TITLE: 'Retirer un joueur',
    REMOVE_MESSAGE: (name: string) => `Retirer ${name} de cette compétition ?`,
  },

  REFEREE: {
    RESIGN: "Êtes-vous sûr de vouloir démissionner de l'arbitrage ?",
    REVOKE: (name: string) =>
      `Voulez-vous vraiment révoquer les droits de ${name} ?`,
  },
} as const;
