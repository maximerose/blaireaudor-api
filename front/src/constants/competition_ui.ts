import { ICONS } from '@/constants/icons';

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
  DETAIL: {
    LOADING: 'Récupération de la compétition',
    NOT_FOUND: 'Compétition non trouvée',
    SYNCING: 'Synchronisation...',
    PROTECTED: 'Historique protégé',
    MASKED_POINTS: '??',
    POINTS_SHORT: 'pts',
    SECTIONS: {
      HEADER: {
        JOIN_CODE_ARIA: "Code d'accès : ",
        DATES_ARIA: 'Dates : ',
        COUNTDOWN_PREFIX: 'Clôture',
        CREATOR_LABEL: 'Créateur',
        REFEREE_LABEL: (count: number) => `Arbitre${count > 1 ? 's' : ''}`,
        MULTIPLIERS_SECTION_TITLE: `Calendrier des Bonus ${ICONS.FIRE}`,
      },
      REPORTING: {
        NOT_STARTED_TITLE: "L'heure de la délation n'a pas sonné...",
        NOT_STARTED_SUBTITLE: 'Ouverture ',
        NOT_STARTED_ELAPSED: 'lancée !',
        BONUS_WARNING: (multiplier: number) =>
          `Attention : Multiplicateur x${multiplier} activé !`,
        BONUS_HINT:
          "Indiquez le score de base de l'action, le bonus sera calculé automatiquement dans le journal.",
        REPORT_BUTTON: 'Dénoncer un adversaire',
      },
      LEADERBOARD: {
        TITLE: 'Classement',
        ARIA_TITLE: (competitionName?: string) =>
          `Classement pour la compétition ${competitionName ? competitionName : 'en cours'}`,
        FOG_OF_WAR: {
          ACTIVE: `${ICONS.FOG_ACTIVE} Brouillard de guerre actif`,
        },
        EMPTY: {
          TITLE: "No man's land...",
          MESSAGE:
            "L'arène est déserte... Aucun blaireau n'a osé relever le défi pour le moment.",
        },
        RANK: 'Rang ',
        EXAEQUO: 'Ex-æquo',
        DELETE_PARTICIPATION: 'Supprimer la participation',
        ARIA_DELETE_PARTICIPATION: (playerName: string) =>
          `Supprimer la participation de ${playerName} ?`,
        ARIA_SCORE: (points: number) => `Score : ${points} points`,
      },
      ACTIONS: {
        TITLE: 'Journal des actions',
        ENTRIES: (count: number) => `${count} entrées`,
        TABLE: {
          COLUMN_DATE: 'Date',
          COLUMN_PLAYER: 'Joueur',
          COLUMN_ACTION: 'Action',
          COLUMN_POINTS: 'Points',
          EMPTY_ACTIONS_TITLE: 'Journal vide',
          EMPTY_ACTIONS_SUBTITILE: 'Aucune action validée...',
          ALL_DATES: 'Toutes les dates',
        },
        SUB_SECTIONS: {
          PENDING: `${ICONS.REFEREE} Actions en attente`,
          MY_SUBMISSIONS: 'Mes envois',
          OTHER_SUBMISSIONS: 'Signalements des autres',
          REJECTED: `${ICONS.TRASH} Actions rejetées (Archive)`,
        },
        REPORTED_BY: 'Dénoncé par : ',
      },
    },
  },
} as const;
