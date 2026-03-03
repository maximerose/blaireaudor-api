export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COMPETITION: (slug: string) => `/competition/${slug}`,
  ADMIN: '/admin',
};
