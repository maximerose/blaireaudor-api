import React from 'react';
import { cn } from '@/shared/utils';
import { Text, TEXT_VARIANT, TEXT_THEME } from './Text';
import { BUTTONS, ICONS } from '@/shared/constants';

export const BADGE_VARIANT = {
  GOLD: 'gold',
  SILVER: 'silver',
  BRONZE: 'bronze',
  SUCCESS: 'success',
  DANGER: 'danger',
  INFO: 'info',
  WARNING: 'warning',
  GHOST: 'ghost',
  CREATOR: 'creator',
  REFEREE: 'referee',
  GUEST: 'guest',
  BONUS: 'bonus',
  ME: 'me',
} as const;

export type BadgeVariant = (typeof BADGE_VARIANT)[keyof typeof BADGE_VARIANT];

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  isPulse?: boolean;
  icon?: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}

const VARIANTS_STYLES: Record<BadgeVariant, string> = {
  [BADGE_VARIANT.GOLD]: 'bg-gold-soft border-gold-border text-gold',
  [BADGE_VARIANT.SILVER]: 'bg-silver-soft border-silver-border text-silver',
  [BADGE_VARIANT.BRONZE]: 'bg-bronze-soft border-bronze-border text-bronze',
  [BADGE_VARIANT.SUCCESS]:
    'bg-success-soft border-success-border text-success-bright',
  [BADGE_VARIANT.DANGER]:
    'bg-danger-soft border-danger-border text-danger-bright',
  [BADGE_VARIANT.INFO]: 'bg-info-soft border-info-border text-info-bright',
  [BADGE_VARIANT.WARNING]:
    'bg-warning-soft border-warning-border text-warning-bright',
  [BADGE_VARIANT.GHOST]: 'bg-surface-base border-border-subtle text-text-muted',
  [BADGE_VARIANT.CREATOR]:
    'bg-creator-soft border-creator-border text-role-creator-bright',
  [BADGE_VARIANT.REFEREE]:
    'bg-referee-soft border-referee-border text-role-referee-bright',
  [BADGE_VARIANT.GUEST]: 'bg-guest-soft border-guest-border text-role-guest',
  [BADGE_VARIANT.BONUS]:
    'bg-bonus-soft border-bonus-border text-game-bonus-bright',
  [BADGE_VARIANT.ME]: 'bg-me-soft border-me-border text-player-me',
};

export const Badge = ({
  children,
  variant = BADGE_VARIANT.GOLD,
  className,
  isPulse = false,
  icon,
  onRemove,
  removeLabel = BUTTONS.REMOVE,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded-md border shrink-0 transition-default whitespace-nowrap',
        onRemove ? 'pl-2.5 pr-1' : 'px-2',
        VARIANTS_STYLES[variant],
        isPulse && 'animate-pulse motion-reduce:animate-none',
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="flex items-center justify-center text-xs"
        >
          {icon}
        </span>
      )}
      <Text
        as="span"
        variant={TEXT_VARIANT.MICRO}
        colorTheme={TEXT_THEME.INHERIT}
        className="tracking-normal inline-flex items-center gap-1"
      >
        {children}
      </Text>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="w-4 h-4 rounded-md inline-flex items-center justify-center text-inherit opacity-40 hover:opacity-100 hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-current transition-all select-none"
          title={removeLabel}
          aria-label={removeLabel}
        >
          <span className="text-[10px] leading-none" aria-hidden="true">
            {ICONS.CANCEL}
          </span>
        </button>
      )}
    </span>
  );
};
