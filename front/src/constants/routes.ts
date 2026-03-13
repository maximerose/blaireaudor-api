export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COMPETITION: (slug: string) => `/competitions/${slug}`,
  CREATE_COMPETITION: '/admin/competition',
  ADMIN: '/admin',
  PLAYERS: '/players',
  SEARCH_PLAYERS: (query: string) => `/players?display_name=${query}`,
  ADD_PLAYERS: (id: string) => `/admin/competition/${id}/add-players`,
};
