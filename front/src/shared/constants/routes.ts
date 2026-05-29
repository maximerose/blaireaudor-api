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
    FORGOT_PASSWORD: '/forgot-password',
    DASHBOARD: '/dashboard',
    COMPETITIONS_LIST: '/competitions',
    ADMIN_DASHBOARD: '/admin',
    ADMIN_CREATE_COMPETITION: '/competition/new',
    PROFILE: '/profile',
    STATS: '/stats',
    NOTIFICATIONS: '/notifications',
    ADMIN_BASE: import.meta.env.VITE_ADMIN_URL || '/admin',

    // Routes dynamiques
    RESET_PASSWORD: (token: string) => `/reset-password/${token}`,
    RESET_PASSWORD_PATH: '/reset-password/:token',
    COMPETITION_DETAIL: (code: string) => `/competitions/${code}`,
    COMPETITION_DETAIL_PATH: '/competitions/:code',
    LOGIN_WITH_JOIN_CODE: (code: string) => `/login?code=${code}`,
    REGISTER_WITH_JOIN_CODE: (code: string) => `/register?code=${code}`,
    QR_JOIN: (code: string) => `/q/${code}`,
    QR_JOIN_PATH: '/q/:code',
  },
} as const;
