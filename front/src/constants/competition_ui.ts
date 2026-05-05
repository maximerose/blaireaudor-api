import { ICONS } from './icons';

export const COMPETITION_UI = {
  ADMIN: {
    GENERAL: {
      SETTINGS_LABEL: 'Paramètres de la compétition',
      TITLE: "Console d'administration",
      CONFIG_TITLE: 'Configuration',
      BUTTON_EXPAND: "Gérer l'arène",
      BUTTON_EDIT: 'Modifier les paramètres',
      REFEREES_COUNT: (count: number) => `${count} Arbitre(s)`,
    },
    BONUS: {
      TITLE: `${ICONS.FIRE} Multiplicateurs`,
      SUBTITLE: 'Multipliez les points de la journée.',
      EMPTY: 'Aucun multiplicateur programmé.',
    },
    REFEREE: {
      TITLE: "Équipe d'arbitrage",
      SUBTITLE: 'Coopter des membres pour vous aider ou quitter votre poste.',
      YOU: '(Vous)',
      TOOLTIP_RESIGN: 'Démissionner',
      TOOLTIP_REVOKE: 'Révoquer cet arbitre',
      ARIA_REVOKE: 'Révoquer',
      LAST_REF_WARNING: `${ICONS.DANGER} Vous êtes le dernier arbitre. Ajoutez un successeur avant de pouvoir démissionner.`,
      APPOINT: 'Nommer',
    },
    FOG: {
      LABEL: 'Brouillard :',
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
  ACTIONS: {
    TABLE: {
      COLUMN_DATE: 'Date',
      COLUMN_PLAYER: 'Joueur',
      COLUMN_ACTION: 'Action',
      COLUMN_POINTS: 'Points',
      EMPTY_ACTIONS_TITLE: 'Journal vide',
      EMPTY_ACTIONS_SUBTITILE: 'Aucune action validée...',
    },
    PENDING: {
      TITLE: `${ICONS.REFEREE} Actions en attente`,
      MY_SUBMISSIONS: 'Mes envois',
      OTHER_SUBMISSIONS: 'Signalements des autres',
    },
    REPORTED_BY: 'Dénoncé par : ',
    POINTS_SHORT: 'pts',
  },
} as const;
