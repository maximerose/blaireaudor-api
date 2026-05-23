export const RULES = {
  AUTH: {
    MIN_DISPLAY_NAME: 2,
    MIN_USERNAME: 3,
    MIN_PASSWORD: 6,
  },

  ACTION: {
    MIN_DESCRIPTION: 3,
  },

  BONUS: {
    MIN_MULTIPLIER: 2,
  },

  COMPETITION: {
    MIN_NAME: 3,
    MIN_JOIN_CODE: 3,
  },

  SEARCH: {
    DEBOUNCE_DELAY: 400,
    MIN_CHARS: 2,
  },
} as const;
