import { pluralize, ICONS } from '@/shared';

export const STATS_VAL = {
  POINTS: (count: number) => `${count} pts`,
  ACTIONS: (count: number) => `${count} ${pluralize(count, 'action')}`,
  PERCENT: (count: number | null) =>
    `${typeof count === 'number' ? count : '-'}%`,
} as const;

export const DASHBOARD_UI = {
  BUTTONS: {
    VIEW_COMPETITION: 'Voir le classement',
    MANAGE_COMPETITION: 'Gérer la compétition',
    ENTER_COMPETITION: 'Entrer dans la compétition',
    CREATE_COMPETITION: '+ Créer une compétition',
    JOIN_COMPETITION: 'Rejoindre une compétition',
  },
  HEADER: {
    TITLE: 'Tableau de bord',
    GREETING: 'Salut ',
    TOTAL_PARTICIPATIONS: (count: number) =>
      count > 0
        ? `${count} ${pluralize(count, 'participation')} au total`
        : 'Aucune compétition active',
    STATS: {
      ACTIVE: 'En cours',
      UPCOMING: 'À venir',
      FINISHED: (count: number) => `${pluralize(count, 'Terminée')}`,
      CREATED: (count: number) => `${pluralize(count, 'Créée')}`,
      REFEREED: (count: number) => `${pluralize(count, 'Arbitrée')}`,
    },
    ARIA: {
      SUMMARY: 'Résumé de tes compétitions',
      STAT_DETAIL: (val: number, label: string) =>
        `${val} ${pluralize(val, 'compétition')} ${label.toLowerCase()}`,
    },
    ADMIN_ACCESS: `${ICONS.REFEREE} Espace d'arbitrage`,
  },
  NB_COMPETITIONS: (count: number) =>
    `${count} ${pluralize(count, 'compétition')}`,
  NO_COMPETITON_ENTRIES: 'Aucune compétition',
  CARD: {
    ACCESS_LABEL: 'Accès',
    PARTICIPANTS_LABEL: 'Participants',
    EMPTY_COMPETITION: 'Tournoi vide',
    PARTICIPANT_COUNT: (count: number) =>
      `${count} ${pluralize(count, 'Blaireau', 'Blaireaux')}`,
    PENDING_ACTIONS_COUNT: (count: number) =>
      `${count} ${pluralize(count, 'action')} en attente`,
    RESULTS: 'Résultats',
    FOG_OF_WAR: 'Brouillard de guerre',
    MASKED_SCORES: 'Scores masqués',
    OFFICIAL_ROLE: 'Rôle Officiel',
    SPECTATOR_MODE: 'Mode spectateur / gestion',
    ARIA: {
      DATES: 'Dates : ',
      JOIN_CODE: "Code d'accès : ",
      QUICK_ACTIONS: 'Actions rapides',
      PARTICIPANTS: (count: number) =>
        `${count} ${pluralize(count, 'participant')}`,
      ENTER_COMPETITION: (name: string) =>
        `Rejoindre dans la compétition ${name}`,
      RANK_SCORE: (rank: number, score: number) =>
        `Rang : ${rank}, Score : ${score}`,
    },
    SECTIONS: {
      ONGOING: 'En cours',
      UPCOMING: 'À venir',
      FINISHED: (count: number) => `${pluralize(count, 'Terminée')}`,
    },
    EMPTY: {
      TITLE: 'Aucune compétition',
      MESSAGE: 'Rejoins une compétition !',
    },
  },
  STATS_PANEL: {
    TITLE: 'Statistiques de carrière',
    RECORD_EMPTY: 'Aucune dénonciation envoyée',

    POINTS: {
      TITLE: '🎯 Section des Points',
      TOTAL: {
        LABEL: 'Total cumulé',
        VAL: (count: number) => `${STATS_VAL.POINTS(count)}`,
      },
      AVG: {
        LABEL: 'Moyenne / compétition',
        VAL: (count: number) => `${STATS_VAL.POINTS(count)}`,
      },
      MAX: {
        LABEL: 'Pire compétition',
        VAL: (count: number) => `${STATS_VAL.POINTS(count)}`,
      },
    },

    ACTIONS: {
      TITLE: '🦡 Section des Actions',
      TOTAL: {
        LABEL: 'Total cumulé',
        VAL: (count: number) => `${STATS_VAL.ACTIONS(count)}`,
      },
      AVG: {
        LABEL: 'Moyenne / compétition',
        VAL: (count: number) => `${STATS_VAL.ACTIONS(count)}`,
      },
      MAX: {
        LABEL: 'Pire compétition',
        VAL: (count: number) => `${STATS_VAL.ACTIONS(count)}`,
      },
    },

    DELATION: {
      TITLE: '⚖️ Section de la Délation',
      TOTAL: {
        LABEL: (count: number) => `${pluralize(count, 'envoyée')}`,
        VAL: (count: number) => `${STATS_VAL.ACTIONS(count)}`,
      },
      PRECISION: {
        LABEL: 'Précision de tir',
        VAL: (count: number | null) => `${STATS_VAL.PERCENT(count)}`,
        HINT: "Représente le pourcentage de tes dénonciations validées avec succès par l'équipe d'arbitrage. Un taux élevé prouve la légitimité de tes signalements.",
      },
      KARMA: {
        LABEL: 'Karma Index',
        HINT: "Calcule le ratio entre les dénonciations envoyées et celles reçues. Supérieur à 1 : tu es un Prédateur (tu balances plus que tu n'encaisses). Inférieur à 1 : tu es un Martyr (la cible préférée de la bande).",
      },
    },

    FOCUS: {
      RECORD: 'Plus grosse action de blaireau',
      WORST_STAB: 'Pire coup envoyé',

      STAB_DENOUNCER: 'Dénoncé par : ',
      STAB_VICTIM: 'Victime : ',
    },
  },
  PALMARES_PANEL: {
    TITLE: 'Palmarès historique des saisons',
    EMPTY: 'Aucune saison archivée dans ton tableau de chasse.',
    TABLE: {
      TH_COMPETITION: 'Compétition',
      TH_RANK: 'Classement',
      TH_SCORE: 'Score Final',
    },
  },
} as const;
