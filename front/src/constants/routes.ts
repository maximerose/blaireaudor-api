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
  SEARCH_PLAYERS: (query: string) =>
    `/search/players?displayName=${query}&unlinked=true`,
  ADD_PLAYERS: (id: string) => `/admin/competition/${id}/add-players`,
};
