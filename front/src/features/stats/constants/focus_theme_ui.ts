import { TEXT_THEME } from '@/shared';
import { PLAYER_STATS_GENERAL } from './player_stats_ui';

export const FOCUS_THEME_CONFIG = {
  danger: {
    cardClass: 'border-danger-border/40 bg-danger-soft/5',
    iconClass: 'bg-danger/20 text-danger-bright',
    textTheme: TEXT_THEME.DANGER,
    glowClass: 'drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]',
    defaultColor: 'text-danger-bright',
    prefix: PLAYER_STATS_GENERAL.FOCUS.STAB_DENOUNCER,
  },
  info: {
    cardClass: 'border-info-border/30 bg-info-soft/5',
    iconClass: 'bg-info/20 text-info-bright',
    textTheme: TEXT_THEME.INFO,
    glowClass: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]',
    defaultColor: 'text-info-bright',
    prefix: PLAYER_STATS_GENERAL.FOCUS.STAB_VICTIM,
  },
} as const;
