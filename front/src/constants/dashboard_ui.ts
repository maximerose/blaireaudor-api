import { pluralize } from '@/utils';
import { ICONS } from './icons';

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
      FINISHED: 'Terminées',
      CREATED: 'Créées',
      REFEREED: 'Arbitrées',
    },
    ARIA: {
      SUMMARY: 'Résumé de vos compétitions',
      STAT_DETAIL: (val: number, label: string) =>
        `${val} ${pluralize(val, 'compétition')} ${label.toLowerCase()}`,
    },
    ADMIN_ACCESS: `${ICONS.REFEREE} Espace d'arbitrage`,
  },
  NO_COMPETITON_ENTRIES: 'Aucune compétition',
  CARD: {
    ACCESS_LABEL: 'Accès',
    PARTICIPANTS_LABEL: 'Participants',
    EMPTY_COMPETITION: 'Tournoi vide',
    PARTICIPANT_COUNT: (count: number) =>
      `${count} ${pluralize(count, 'Blaireau', 'Blaireaux')}`,
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
      MANAGEMENT: `${ICONS.REFEREE} Gestion des compétitions`,
      PARTICIPATIONS: 'Tes Participations',
    },
    EMPTY: {
      TITLE: 'Aucune compétition',
      MESSAGE: 'Rejoins une compétition !',
    },
  },
} as const;
