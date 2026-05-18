const BASES = {
  COMPETITIONS: '/competitions',
  ACTIONS: '/actions',
  PARTICIPATIONS: '/participations',
  BONUS: '/bonus_days',
  REFEREE: '/referee',
  ADMIN_COMP: '/admin/competition',
  USERS: '/users',
  PLAYERS: '/players',
  API_PREFIX: '/api',
} as const;

export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  ENDPOINTS: {
    // AUTH & IDENTITÉ (Lié au compte utilisateur)
    AUTH: {
      LOGIN: '/login',
      LOGOUT: '/logout',
      REGISTER: '/register',
      ME: '/me',
      UPDATE_PROFILE: '/me',
    },

    // USER (Gestion du compte et sécurité)
    USER: {
      DETAIL: (id: string) => `${BASES.USERS}/${id}`,
      CHECK_USERNAME: (username: string) =>
        `/check-username?username=${encodeURIComponent(username)}`,
      CHECK_EMAIL: (email: string) =>
        `/check-email?email=${encodeURIComponent(email)}`,
    },

    // PLAYER (Le profil métier, les scores, la recherche)
    PLAYER: {
      LIST: BASES.PLAYERS,
      SEARCH: (query: string) => `/search/players?displayName=${query}`,
      CHECK_BY_USERNAME: (username: string) =>
        `/check-player?username=${username}`,
    },

    // COMPETITIONS (Les Arènes)
    COMPETITIONS: {
      BASE: BASES.COMPETITIONS,
      BY_CODE: (code: string) => `${BASES.COMPETITIONS}/by-code/${code}`,
      CHECK_JOIN_CODE: (code: string) =>
        `${BASES.COMPETITIONS}/check/join-code?code=${code}`,
      DETAIL: (id: string) => `${BASES.COMPETITIONS}/${id}`,
      LEADERBOARD: (id: string) => `${BASES.COMPETITIONS}/${id}/leaderboard`,
      ACTIONS: (id: string) => `${BASES.COMPETITIONS}/${id}/actions`,
      ACTIONS_DATES: (id: string) => `${BASES.COMPETITIONS}/${id}/action-dates`,
      PENDING_COUNT: (id: string) =>
        `${BASES.COMPETITIONS}/${id}/pending-count`,
    },

    // ACTIONS & PARTICIPATIONS
    ACTIONS: {
      BASE: BASES.ACTIONS,
      DETAIL: (id: string) => `${BASES.ACTIONS}/${id}`,
    },
    PARTICIPATIONS: {
      BASE: BASES.PARTICIPATIONS,
      DETAIL: (id: string) => `${BASES.PARTICIPATIONS}/${id}`,
    },

    // ARBITRAGE
    REFEREE: {
      PENDING_GLOBAL: `${BASES.REFEREE}/pending-actions`,
    },

    // BONUS
    BONUS: {
      BASE: BASES.BONUS,
      DETAIL: (id: string) => `${BASES.BONUS}/${id}`,
      BY_COMPETITION: (competitionId: string) =>
        `${BASES.BONUS}?competition=${competitionId}`,
    },

    // ADMINISTRATION (Actions sur l'Arène)
    ADMIN: {
      COMPETITION_CREATE: BASES.ADMIN_COMP,
      ADD_PARTICIPANTS: (id: string) => `${BASES.ADMIN_COMP}/${id}/add-players`,
      ADD_REFEREE: (id: string) => `${BASES.ADMIN_COMP}/${id}/referees/add`,
      REMOVE_REFEREE: (id: string) =>
        `${BASES.ADMIN_COMP}/${id}/referees/remove`,
    },
  },

  // ---------------------------------------------------------
  // GÉNÉRATEURS D'IRI (API Platform)
  // ---------------------------------------------------------
  IRI: {
    PLAYER: (id: string) => `${BASES.API_PREFIX}${BASES.PLAYERS}/${id}`,
    USER: (id: string) => `${BASES.API_PREFIX}${BASES.USERS}/${id}`,
    COMPETITION: (id: string) =>
      `${BASES.API_PREFIX}${BASES.COMPETITIONS}/${id}`,
    ACTION: (id: string) => `${BASES.API_PREFIX}${BASES.ACTIONS}/${id}`,
  },

  GROUPS: {
    JSON_LD: 'application/ld+json',
    MERGE_PATCH: 'application/merge-patch+json',
  },
} as const;
