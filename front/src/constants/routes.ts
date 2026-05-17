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
    PROFILE: '/profile',
    ARBITRAGE: '/arbitrage',

    // Routes dynamiques
    COMPETITION_DETAIL: (code: string) => `/competitions/${code}`,
    COMPETITION_DETAIL_PATH: '/competitions/:code',
  },
} as const;
