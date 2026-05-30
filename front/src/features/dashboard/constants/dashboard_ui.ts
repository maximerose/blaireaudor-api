import { PLAYER_STATS_PALMARES } from '@/features/stats';
import { pluralize } from '@/shared';

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
    CREATE_COMPETITION: 'Créer une compétition',
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
      MESSAGE: 'Crée ou rejoins une compétition !',
    },
  },
  PALMARES_PANEL: {
    TITLE: PLAYER_STATS_PALMARES.TITLE,
    EMPTY: PLAYER_STATS_PALMARES.EMPTY,
    TABLE: {
      TH_COMPETITION: PLAYER_STATS_PALMARES.TH_COMPETITION,
      TH_RANK: PLAYER_STATS_PALMARES.TH_RANK,
      TH_SCORE: PLAYER_STATS_PALMARES.TH_SCORE,
    },
  },
} as const;
