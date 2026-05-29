import { pluralize } from '@/shared';

export const COMPETITION_UI = {
  CREATE: {
    TITLE: "Création d'une nouvelle compétition",
  },
  REDIRECT: 'Redirection vers la compétition...',
  ADMIN: {
    GENERAL: {
      SETTINGS_LABEL: 'Paramètres de la compétition',
      TITLE: "Console d'administration",
      CONFIG_TITLE: 'Configuration',
      BUTTON_EXPAND: 'Gérer la compétition',
      BUTTON_EDIT: 'Modifier les paramètres',
      REFEREES_COUNT: (count: number) =>
        `${count} ${pluralize(count, 'Arbitre')}`,
      DELETE_ZONE: 'Zone dangereuse',
      DELETE_HINT: 'La suppression de la compétition est définitive',
    },
    BONUS: {
      TITLE: `Multiplicateurs`,
      SUBTITLE: 'Multiplie les points de la journée.',
      EMPTY: 'Aucun multiplicateur programmé.',
    },
    REFEREE: {
      TITLE: "Équipe d'arbitrage",
      SUBTITLE: "Ajoute des arbitres pour t'aider ou quitte ton poste.",
      TOOLTIP_RESIGN: 'Démissionner',
      TOOLTIP_REVOKE: 'Révoquer cet arbitre',
      ARIA_REVOKE: 'Révoquer',
      LAST_REF_WARNING:
        'Tu es le dernier arbitre. Ajoute un successeur avant de pouvoir démissionner.',
      APPOINT: 'Nommer',
    },
    MULTIPLIER: {
      TITLE: 'Multiplicateurs',
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
      SUBMIT: 'Clôturer la compétition',
      PENDING_WARNING: (count: number) =>
        `${count} ${pluralize(count, 'action')} en attente`,
      COMPETITION_NOT_STARTED:
        'La compétition doit avoir débuté pour être clôturée.',
    },
    MERGE: {
      ROW_TOOLTIP: 'Raccorder ce profil à un compte inscrit',
      TITLE: 'Raccorder un profil',
      SUBTITLE: (name: string) => `Lier le profil pour ${name}`,
      ALERT_WARNING: (count: number) =>
        `Cette action va transférer définitivement les ${count} ${pluralize(count, 'action')} et l'historique des points associés vers le compte sélectionné. Le profil invité sera détruit.`,
      INPUT_LABEL: 'Rechercher le compte réel cible',
      INPUT_PLACEHOLDER: 'Pseudo ou adresse email...',
      SUCCESS_TOAST: 'Fusion et réattribution opérées avec succès !',
      ERROR_TOAST: 'Échec de la fusion.',
      SUBMIT_BUTTON: 'Confirmer la Fusion',
    },
  },
  DETAIL: {
    LOADING: 'Récupération de la compétition',
    NOT_FOUND: 'Compétition non trouvée',
    SYNCING: 'Synchronisation...',
    PROTECTED: 'Historique protégé',
    MASKED_POINTS: '??',
    POINTS_SHORT: 'pts',
    COUNTDOWN: {
      TOMORROW: 'demain',
      IN_DAYS: (days: number) => `dans ${days} jours`,
      ELAPSED: 'Terminée',
    },
    SECTIONS: {
      HEADER: {
        JOIN_CODE_ARIA: "Code d'accès : ",
        DATES_ARIA: 'Dates : ',
        COUNTDOWN_PREFIX: 'Clôture',
        CREATOR_LABEL: 'Créateur',
        REFEREE_LABEL: (count: number) => pluralize(count, 'Arbitre'),
        MULTIPLIERS_SECTION_TITLE: 'Calendrier des Bonus',
        QR_BUTTON: 'QR Code',
        QR_MODAL_TITLE: 'Inviter des blaireaux',
        QR_MODAL_SUBTITLE: 'Fais scanner ce code pour une entrée directe.',
        QR_DIRECT_LINK: 'Code manuel :',
      },
      REPORTING: {
        BONUS_DAY: 'Journée bonus en cours !',
        NOT_STARTED_TITLE: "L'heure de la délation n'a pas sonné...",
        NOT_STARTED_SUBTITLE: 'Ouverture ',
        NOT_STARTED_ELAPSED: 'lancée !',
        BONUS_WARNING: (multiplier: number) =>
          `Attention: Multiplicateur x${multiplier} activé!`,
        BONUS_HINT:
          "Indique le score de base de l'action, le bonus sera calculé automatiquement dans le journal.",
        REPORT_BUTTON: 'Dénoncer un adversaire',
      },
      LEADERBOARD: {
        NB_PLAYERS: (count: number) => `${count} ${pluralize(count, 'joueur')}`,
        TITLE: 'Classement',
        ARIA_TITLE: (competitionName?: string) =>
          `Classement pour la compétition ${competitionName ? competitionName : 'en cours'} `,
        FOG_OF_WAR: {
          ACTIVE: 'Brouillard de guerre actif',
        },
        EMPTY: {
          TITLE: "No man's land...",
          MESSAGE:
            "L'arène est déserte... Aucun blaireau n'a osé relever le défi pour le moment.",
        },
        RANK: 'Rang ',
        EXAEQUO: 'Ex-æquo',
        DELETE_PARTICIPATION: 'Supprimer la participation',
        ARIA_LEAVE_COMPETITION: 'Quitter la compétition ?',
        ARIA_DELETE_PARTICIPATION: (playerName: string) =>
          `Supprimer la participation de ${playerName} ?`,
        ARIA_RANK: (rank: number, suffix: string) => `Rang : ${rank}${suffix}`,
        ARIA_SCORE: (points: number) =>
          `Score: ${points} ${pluralize(points, 'point')}`,
      },
      ACTIONS: {
        NB_ACTIONS: (count: number) => `${count} ${pluralize(count, 'action')}`,
        TITLE: 'Journal des actions',
        LOADING: 'Chargement des actions...',
        END: 'Fin des actions',
        TABLE: {
          COLUMN_DATE: 'Date',
          COLUMN_PLAYER: 'Joueur',
          COLUMN_ACTION: 'Action',
          COLUMN_POINTS: 'Points',
          EMPTY_ACTIONS_TITLE: 'Journal vide',
          EMPTY_ACTIONS_SUBTITILE: 'Aucune action validée...',
          ALL_DATES: 'Toutes les dates',
          ARIA_TABLE: 'Historique des actions',
          ARIA_FILTER_DATE: 'Filtrer les actions par date',
        },
        SUB_SECTIONS: {
          PENDING: `Actions en attente`,
          MY_SUBMISSIONS: 'Mes envois',
          OTHER_SUBMISSIONS: 'Signalements des autres',
          REJECTED: 'Actions rejetées (Archive)',
        },
        OTHER_PLAYERS: 'Autres joueurs...',
        REPORTED_BY: 'Dénoncé par : ',
        ARIA: {
          UPDATE_ACTION: "Modifier l'action",
        },
      },
      STATS: {
        TITLE: 'Statistiques',
        LOADING_ANALYTICS: 'Analyse des graphiques...',
      },
    },
  },
} as const;
