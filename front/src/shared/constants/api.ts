export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
} as const;

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
  RESET_PASSWORD: '/reset-password',
  NOTIFICATIONS: '/notifications',
  PUSH_SUBSCRIPTIONS: '/push_subscriptions',
} as const;

export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login',
      LOGOUT: '/logout',
      REGISTER: '/register',
      ME: '/me',
      UPDATE_PROFILE: '/me',
      RESET_PASSWORD_REQUEST: BASES.RESET_PASSWORD,
      RESET_PASSWORD_VALIDATE: (token: string) =>
        `${BASES.RESET_PASSWORD}/${token}`,
      RESET_PASSWORD_RESET: (token: string) =>
        `${BASES.RESET_PASSWORD}/${token}`,
      REFRESH: '/token/refresh',
    },

    USER: {
      DETAIL: (id: string) => `${BASES.USERS}/${id}`,
      CHECK_USERNAME: (username: string) =>
        `/check-username?username=${encodeURIComponent(username)}`,
      CHECK_EMAIL: (email: string) =>
        `/check-email?email=${encodeURIComponent(email)}`,
      SEARCH_USERS: (query: string) =>
        `/users/search?q=${encodeURIComponent(query)}`,
    },

    PLAYER: {
      LIST: BASES.PLAYERS,
      SEARCH: (query: string) =>
        `${BASES.PLAYERS}/search?displayName=${encodeURIComponent(query)}`,
    },

    COMPETITIONS: {
      BASE: BASES.COMPETITIONS,
      ADD_PARTICIPANTS: (id: string) =>
        `${BASES.COMPETITIONS}/${id}/add-players`,
      ADD_REFEREE: (id: string) => `${BASES.COMPETITIONS}/${id}/referees/add`,
      REMOVE_REFEREE: (id: string) =>
        `${BASES.COMPETITIONS}/${id}/referees/remove`,
      BY_CODE: (code: string) => `${BASES.COMPETITIONS}/by-code/${code}`,
      CHECK_JOIN_CODE: (code: string) =>
        `${BASES.COMPETITIONS}/check/join-code?code=${code}`,
      JOIN: `${BASES.COMPETITIONS}/join`,
      DETAIL: (id: string) => `${BASES.COMPETITIONS}/${id}`,
      LEADERBOARD: (id: string) => `${BASES.COMPETITIONS}/${id}/leaderboard`,
      ACTIONS: (id: string) => `${BASES.COMPETITIONS}/${id}/actions`,
      ACTIONS_DATES: (id: string) => `${BASES.COMPETITIONS}/${id}/action-dates`,
      PENDING_COUNT: (id: string) =>
        `${BASES.COMPETITIONS}/${id}/pending-count`,
      MERGE_PLAYERS: (id: string) =>
        `${BASES.COMPETITIONS}/${id}/merge-players`,
    },

    ACTIONS: {
      BASE: BASES.ACTIONS,
      DETAIL: (id: string) => `${BASES.ACTIONS}/${id}`,
    },
    PARTICIPATIONS: {
      BASE: BASES.PARTICIPATIONS,
      DETAIL: (id: string) => `${BASES.PARTICIPATIONS}/${id}`,
    },

    REFEREE: {
      PENDING_GLOBAL: `${BASES.REFEREE}/pending-actions`,
    },

    BONUS: {
      BASE: BASES.BONUS,
      DETAIL: (id: string) => `${BASES.BONUS}/${id}`,
      BY_COMPETITION: (competitionId: string) =>
        `${BASES.BONUS}?competition=${competitionId}`,
    },

    NOTIFICATIONS: {
      BASE: BASES.NOTIFICATIONS,
      DETAIL: (id: string) => `${BASES.NOTIFICATIONS}/${id}`,
      PUSH_SUBSCRIBE: BASES.PUSH_SUBSCRIPTIONS,
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
