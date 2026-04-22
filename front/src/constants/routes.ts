export const ROUTES = {
  // ---------------------------------------------------------
  // 1. ROUTES DE NAVIGATION (React Router)
  // Usage: navigate(ROUTES.NAV_DASHBOARD)
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
  // Usage: apiFetch(ROUTES.API_ACTIONS)
  // ---------------------------------------------------------
  API_ACTIONS: '/actions',
  API_PLAYERS: '/players',
  API_PARTICIPATIONS: '/participations',
  API_COMPETITIONS: '/competitions',
  API_COMPETITION_BY_CODE: (code: string) => `/competitions/by-code/${code}`,
  API_COMPETITION_LEADERBOARD: (id: string) =>
    `/competitions/${id}/leaderboard`,
  API_COMPETITION_CREATE: '/admin/competition',
  API_COMPETITION_ACTIONS: (id: string) => `/competitions/${id}/actions`,
  API_SEARCH_PLAYERS: (query: string) => `/search/players?displayName=${query}`,
  API_ADD_PLAYERS_TO_COMP: (id: string) =>
    `/admin/competition/${id}/add-players`,
  API_PARTICIPATION_DETAIL: (id: string) => `/participations/${id}`,
  API_COMPETITION_DETAIL: (id: string) => `/competitions/${id}`,
  API_CHECK_USERNAME: (username: string) => `/check-username/${username}`,

  // ---------------------------------------------------------
  // 3. GÉNÉRATEURS D'IRI (Pour les relations dans le JSON body)
  // Usage: player: ROUTES.IRI_PLAYER(id)
  // ---------------------------------------------------------
  IRI_PLAYER: (id: string) => `/api/players/${id}`,
  IRI_COMPETITION: (id: string) => `/api/competitions/${id}`,
  IRI_ACTION: (id: string) => `/api/actions/${id}`,
};
