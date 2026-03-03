export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COMPETITION: (slug: string) => `/competition/${slug}`,
  ADMIN: '/admin',
};
