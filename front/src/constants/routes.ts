export const ROUTES = {
  // ---------------------------------------------------------
  // 1. ROUTES DE NAVIGATION (React Router)
  // ---------------------------------------------------------
  NAV_HOME: '/',
  NAV_LOGIN: '/login',
  NAV_LOGOUT: '/logout',
  NAV_REGISTER: '/register',
  NAV_DASHBOARD: '/dashboard',
  NAV_COMPETITIONS_LIST: '/competitions',
  NAV_COMPETITION_DETAIL_ROUTE: '/competitions/:code',
  NAV_COMPETITION_DETAIL: (code: string) => `/competitions/${code}`,
  NAV_ADMIN_DASHBOARD: '/admin',
  NAV_ADMIN_CREATE_COMPETITION: '/admin/competition',

  // ---------------------------------------------------------
  // 2. ENDPOINTS API (Pour apiFetch)
  // ---------------------------------------------------------
  // Auth & Utilisateurs
  API_REGISTER: '/register',
  API_LOGIN: '/login',
  API_LOGOUT: '/logout',
  API_ME: '/me',
  API_USER_DETAIL: (id: string) => `/users/${id}`,
  API_CHECK_USERNAME: (username: string) => `/check-username/${username}`,
  API_CHECK_PLAYER: (username: string) => `/check-player/${username}`,

  // Compétitions
  API_COMPETITIONS: '/competitions',
  API_COMPETITION_DETAIL: (id: string) => `/competitions/${id}`,
  API_COMPETITION_BY_CODE: (code: string) => `/competitions/by-code/${code}`,
  API_COMPETITION_LEADERBOARD: (id: string) =>
    `/competitions/${id}/leaderboard`,

  // Actions & Participations
  API_ACTIONS: '/actions',
  API_ACTIONS_DETAIL: (id: string) => `/actions/${id}`,
  API_COMPETITION_ACTIONS: (id: string) => `/competitions/${id}/actions`,
  API_PARTICIPATIONS: '/participations',
  API_PARTICIPATION_DETAIL: (id: string) => `/participations/${id}`,
  API_PLAYERS: '/players',
  API_SEARCH_PLAYERS: (query: string) => `/search/players?displayName=${query}`,

  // Bonus days
  API_BONUS_DAYS: '/bonus_days',
  API_BONUS_DAYS_DETAIL: (id: string) => `/bonus_days/${id}`,
  API_BONUS_DAYS_BY_COMPETITION: (competitionId: string) =>
    `/bonus_days?competition=${competitionId}`,

  // Administration
  API_COMPETITION_CREATE: '/admin/competition',
  API_ADD_PLAYERS_TO_COMP: (id: string) =>
    `/admin/competition/${id}/add-players`,
  API_ADD_REFEREE: (id: string) => `/admin/competition/${id}/referees/add`,
  API_REMOVE_REFEREE: (id: string) =>
    `/admin/competition/${id}/referees/remove`,

  // ---------------------------------------------------------
  // 3. GÉNÉRATEURS D'IRI
  // ---------------------------------------------------------
  IRI_PLAYER: (id: string) => `/api/players/${id}`,
  IRI_COMPETITION: (id: string) => `/api/competitions/${id}`,
  IRI_ACTION: (id: string) => `/api/actions/${id}`,
};
