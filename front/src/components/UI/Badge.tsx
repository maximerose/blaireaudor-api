import React from 'react';
import { cn } from '@/utils';

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
}

const VARIANTS_STYLES: Record<BadgeVariant, string> = {
  [BADGE_VARIANT.GOLD]: 'bg-gold/10 text-gold border-gold/20',
  [BADGE_VARIANT.SILVER]: 'bg-silver/10 text-silver border-silver/20',
  [BADGE_VARIANT.BRONZE]: 'bg-bronze/10 text-bronze border-bronze/20',
  [BADGE_VARIANT.SUCCESS]:
    'bg-success/20 text-success-bright border-success-bright/20',
  [BADGE_VARIANT.DANGER]: 'bg-danger/20 text-danger-bright border-danger/20',
  [BADGE_VARIANT.INFO]: 'bg-info/20 text-info-bright border-info-bright/20',
  [BADGE_VARIANT.WARNING]:
    'bg-warning/20 text-warning-bright border-warning-bright/20',
  [BADGE_VARIANT.GHOST]: 'bg-white/5 text-white/40 border-white/10',
  [BADGE_VARIANT.CREATOR]:
    'bg-role-creator/20 text-role-creator-bright border-role-creator-bright/20',
  [BADGE_VARIANT.REFEREE]:
    'bg-role-referee/20 text-role-referee-bright border-role-referee-bright/20',
  [BADGE_VARIANT.GUEST]:
    'bg-role-guest/10 text-role-guest border-role-guest/20',
  [BADGE_VARIANT.BONUS]:
    'bg-game-bonus/20 text-game-bonus-bright border-game-bonus-bright/20',
  [BADGE_VARIANT.ME]: 'bg-player-me/10 text-player-me-bright border-gold/20',
};

export const Badge = ({
  children,
  variant = BADGE_VARIANT.GOLD,
  className = '',
  isPulse = false,
  icon,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-between gap-1 px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-tight shrink-0 transition-default',
        VARIANTS_STYLES[variant],
        isPulse && 'animate-pulse motion-reduce:animate-none',
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="text-[11px] items-center justify-center leading-none -mt-px"
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};
