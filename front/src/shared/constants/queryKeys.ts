export const STALE_TIMES = {
  SHORT: 1000 * 30, // 30 secondes (données très volatiles)
  MUTATION_CHECK: 1000 * 60 * 2, // 2 minutes (validation de formulaires / doublons)
  LONG: 1000 * 60 * 5, // 5 minutes (listes globales, métadonnées)
} as const;

export const QUERY_KEYS = {
  arbitrage: {
    pendingGlobal: ['actions', 'pending-global'] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
    usernameCheck: (username: string) =>
      ['auth', 'username-check', username] as const,
    emailCheck: (email: string) => ['auth', 'email-check', email] as const,
  },
  competition: {
    all: ['competitions'] as const,
    byCode: (code: string) => ['competitions', 'by-code', code] as const,
    byId: (id: string | undefined) => {
      const root = ['competitions', 'by-id', id ?? 'pending'] as const;
      return {
        root,
        leaderboard: [...root, 'leaderboard'] as const,
        actions: [...root, 'actions'] as const,
        actionDates: [...root, 'action-dates'] as const,
        pendingCount: [...root, 'pending-count'] as const,
        bonus: [...root, 'bonus'] as const,
      };
    },
  },
  player: {
    search: (term: string) => ['players', 'search', term] as const,
  },
  notifications: {
    all: ['notifications', 'all'] as const,
  },
} as const;
