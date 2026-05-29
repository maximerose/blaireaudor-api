export const NAV = {
  TITLE: "Le Blaireau d'Or",
  CONNECTED_AS: 'Connecté en tant que ',
  SUBTITLE: {
    DASHBOARD: 'Tableau de bord',
    COMPETITION: (code: string | undefined) => `Competition ${code}`,
    PLAYER: 'Espace joueur',
    ARBITRAGE: 'Espace arbitre',
    SUPER_ADMIN: 'Espace admin',
  },
  LINK: {
    DASHBOARD: 'Tableau de bord',
    PROFILE: 'Mon profil',
    STATS: 'Mes stats',
    SUPER_ADMIN: 'Administration',
    LOGOUT: 'Déconnexion',
  },
  ARIA: {
    HOME: 'Retour au tableau de bord',
    MAIN_NAV: 'Navigation principale',
    OPEN_MENU: 'Ouvrir le menu',
  },
} as const;
