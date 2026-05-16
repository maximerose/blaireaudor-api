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
} as const;
