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
    GREETING: 'Salut ',
    TOTAL_PARTICIPATIONS: (count: number) =>
      count > 0
        ? `${count} participation${count > 1 ? 's' : ''} au total`
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
        `${val} ${val > 1 ? 'compétitions' : 'compétition'} ${label.toLowerCase()}`,
    },
  },
  CARD: {
    ACCESS_LABEL: 'Accès',
    PARTICIPANTS_LABEL: 'Participants',
    EMPTY_COMPETITION: 'Tournoi vide',
    PARTICIPANT_COUNT: (count: number) =>
      `${count} ${count > 1 ? 'Blaireaux' : 'Blaireau'}`,
    RESULTS: 'Résultats',
    FOG_OF_WAR: 'Brouillard de guerre',
    MASKED_SCORES: 'Scores masqués',
    OFFICIAL_ROLE: 'Rôle Officiel',
    SPECTATOR_MODE: 'Mode spectateur / gestion',
    ARIA: {
      DATES: 'Dates : ',
      JOIN_CODE: "Code d'accès : ",
      QUICK_ACTIONS: 'Actions rapides',
      PARTICIPANTS: (count: number) => `${count} participants`,
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
