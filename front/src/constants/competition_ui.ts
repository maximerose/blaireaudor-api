import { ICONS } from './icons';

export const COMPETITION_UI = {
  ADMIN: {
    GENERAL: {
      SETTINGS_LABEL: 'Paramètres de la compétition',
    },
    BONUS: {
      TITLE: `${ICONS.FIRE} Multiplicateurs`,
      SUBTITLE: 'Multipliez les points de la journée.',
      EMPTY: 'Aucun multiplicateur programmé.',
    },
    FOG: {
      ENABLE: 'Activer le brouillard',
      DISABLE: 'Lever le brouillard',
      DESC_ON: 'Cacher les scores pour le suspense',
      DESC_OFF: 'Rendre les scores visibles par tous',
      STATUS_ACTIVE: 'ACTIF',
      STATUS_OFF: 'OFF',
    },
    CLOSE: {
      HEADER: 'Fin de partie',
      SUBMIT: `${ICONS.FLAG} Clôturer la compétition`,
      PENDING_WARNING: (count: number) =>
        `${ICONS.DANGER} ${count} actions en attente`,
    },
  },
  DETAIL: {
    TABLE: {
      COLUMN_DATE: 'Date',
      COLUMN_PLAYER: 'Joueur',
      COLUMN_ACTION: 'Action',
      COLUMN_POINTS: 'Points',
      EMPTY_ACTIONS_TITLE: 'Journal vide',
      EMPTY_ACTIONS_SUBTITILE: 'Aucune action validée...',
    },
  },
} as const;
