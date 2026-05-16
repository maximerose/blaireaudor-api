export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  ENDPOINTS: {
    // AUTH & IDENTITÉ (Lié au compte utilisateur)
    AUTH: {
      LOGIN: '/login',
      LOGOUT: '/logout',
      REGISTER: '/register',
      ME: '/me', // Retourne l'utilisateur connecté
    },

    // USER (Gestion du compte et sécurité)
    USER: {
      DETAIL: (id: string) => `/users/${id}`,
      CHECK_USERNAME: (username: string) =>
        `/check-username?username=${encodeURIComponent(username)}`,
      CHECK_EMAIL: (email: string) =>
        `/check-email?email=${encodeURIComponent(email)}`,
    },

    // PLAYER (Le profil métier, les scores, la recherche)
    PLAYER: {
      LIST: '/players',
      SEARCH: (query: string) => `/search/players?displayName=${query}`,
      CHECK_BY_USERNAME: (username: string) =>
        `/check-player?username=${username}`,
    },

    // COMPETITIONS (Les Arènes)
    COMPETITIONS: {
      BASE: '/competitions',
      BY_CODE: (code: string) => `/competitions/by-code/${code}`,
      CHECK_JOIN_CODE: (code: string) =>
        `/competitions/check/join-code?code=${code}`,
      DETAIL: (id: string) => `/competitions/${id}`,
      LEADERBOARD: (id: string) => `/competitions/${id}/leaderboard`,
      ACTIONS: (id: string) => `/competitions/${id}/actions`,
      ACTIONS_DATES: (id: string) => `/competitions/${id}/action-dates`,
      PENDING_COUNT: (id: string) => `/competitions/${id}/pending-count`,
    },

    // ACTIONS & PARTICIPATIONS
    ACTIONS: {
      BASE: '/actions',
      DETAIL: (id: string) => `/actions/${id}`,
    },
    PARTICIPATIONS: {
      BASE: '/participations',
      DETAIL: (id: string) => `/participations/${id}`,
    },

    // BONUS
    BONUS: {
      BASE: '/bonus_days',
      DETAIL: (id: string) => `/bonus_days/${id}`,
      BY_COMPETITION: (competitionId: string) =>
        `/bonus_days?competition=${competitionId}`,
    },

    // ADMINISTRATION (Actions sur l'Arène)
    ADMIN: {
      COMPETITION_CREATE: '/admin/competition',
      ADD_PARTICIPANTS: (id: string) => `/admin/competition/${id}/add-players`,
      ADD_REFEREE: (id: string) => `/admin/competition/${id}/referees/add`,
      REMOVE_REFEREE: (id: string) =>
        `/admin/competition/${id}/referees/remove`,
    },
  },

  // ---------------------------------------------------------
  // GÉNÉRATEURS D'IRI (API Platform)
  // ---------------------------------------------------------
  IRI: {
    PLAYER: (id: string) => `/api/players/${id}`,
    USER: (id: string) => `/api/users/${id}`,
    COMPETITION: (id: string) => `/api/competitions/${id}`,
    ACTION: (id: string) => `/api/actions/${id}`,
  },

  GROUPS: {
    JSON_LD: 'application/ld+json',
    MERGE_PATCH: 'application/merge-patch+json',
  },
} as const;
