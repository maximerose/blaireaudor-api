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
  success: {
    cardClass: 'border-success-border/40 bg-success-soft/5',
    iconClass: 'bg-success/20 text-success-bright',
    textTheme: TEXT_THEME.SUCCESS,
    glowClass: 'drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]',
    defaultColor: 'text-success-bright',
    prefix: '',
  },
  warning: {
    cardClass: 'border-warning-border/40 bg-warning-soft/5',
    iconClass: 'bg-warning/20 text-warning-bright',
    textTheme: TEXT_THEME.WARNING,
    glowClass: 'drop-shadow-[0_0_6px_rgba(251,146,60,0.4)]',
    defaultColor: 'text-warning-bright',
    prefix: '',
  },
} as const;
