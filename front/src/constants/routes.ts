/**
 * Configuration centralisée des routes et endpoints.
 * Séparation stricte entre USER (Identité/Compte) et PLAYER (Profil/Jeu).
 */
export const ROUTES = {
  // ---------------------------------------------------------
  // 1. NAVIGATION (React Router)
  // ---------------------------------------------------------
  NAV: {
    HOME: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    COMPETITIONS_LIST: '/competitions',
    ADMIN_DASHBOARD: '/admin',
    ADMIN_CREATE_COMPETITION: '/admin/competition',

    // Routes dynamiques
    COMPETITION_DETAIL: (code: string) => `/competitions/${code}`,
    COMPETITION_DETAIL_PATH: '/competitions/:code',
  },

  // ---------------------------------------------------------
  // 2. ENDPOINTS API (Services)
  // ---------------------------------------------------------
  API: {
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
      CHECK_USERNAME: (username: string) => `/check-username/${username}`,
    },

    // PLAYER (Le profil métier, les scores, la recherche)
    PLAYER: {
      LIST: '/players',
      SEARCH: (query: string) => `/search/players?displayName=${query}`,
      CHECK_BY_USERNAME: (username: string) => `/check-player/${username}`,
    },

    // COMPETITIONS (Les Arènes)
    COMPETITIONS: {
      BASE: '/competitions',
      BY_CODE: (code: string) => `/competitions/by-code/${code}`,
      DETAIL: (id: string) => `/competitions/${id}`,
      LEADERBOARD: (id: string) => `/competitions/${id}/leaderboard`,
      ACTIONS: (id: string) => `/competitions/${id}/actions`,
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
  // 3. GÉNÉRATEURS D'IRI (API Platform)
  // ---------------------------------------------------------
  IRI: {
    PLAYER: (id: string) => `/api/players/${id}`,
    USER: (id: string) => `/api/users/${id}`,
    COMPETITION: (id: string) => `/api/competitions/${id}`,
    ACTION: (id: string) => `/api/actions/${id}`,
  },
} as const;
