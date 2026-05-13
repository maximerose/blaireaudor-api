import React from 'react';
import { cn } from '@/utils';

export type BadgeVariant =
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'success'
  | 'danger'
  | 'info'
  | 'warning'
  | 'ghost'
  | 'creator'
  | 'referee'
  | 'guest'
  | 'bonus';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  isPulse?: boolean;
  icon?: React.ReactNode;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  gold: 'bg-gold/10 text-gold border-gold/20',
  silver: 'bg-silver/10 text-silver border-silver/20',
  bronze: 'bg-bronze/10 text-bronze border-bronze/20',
  success: 'bg-success/20 text-success-bright border-success-bright/20',
  danger: 'bg-danger/20 text-danger-bright border-danger/20',
  info: 'bg-info/20 text-info-bright border-info-bright/20',
  warning: 'bg-warning/20 text-warning-bright border-warning-bright/20',
  ghost: 'bg-white/5 text-white/40 border-white/10',
  creator:
    'bg-role-creator/20 text-role-creator-bright border-role-creator-bright/20',
  referee:
    'bg-role-referee/20 text-role-referee-bright border-role-referee-bright/20',
  guest: 'bg-role-guest/10 text-role-guest border-role-guest/20',
  bonus: 'bg-game-bonus/20 text-game-bonus-bright border-game-bonus-bright/20',
};

export const Badge = ({
  children,
  variant = 'gold',
  className = '',
  isPulse = false,
  icon,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-between gap-1 px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-tight shrink-0 transition-default',
        BADGE_VARIANTS[variant],
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
