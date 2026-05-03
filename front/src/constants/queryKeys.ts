export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
    usernameCheck: (username: string) =>
      ['auth', 'username-check', username] as const,
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
        bonus: [...root, 'bonus'] as const,
      };
    },
  },
  player: {
    search: (term: string) => ['players', 'search', term] as const,
  },
} as const;
