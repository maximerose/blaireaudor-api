import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'success'
  | 'danger'
  | 'info'
  | 'warning'
  | 'ghost';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  isPulse?: boolean;
}

export const Badge = ({
  children,
  variant = 'gold',
  className = '',
  isPulse = false,
  ...props
}: BadgeProps) => {
  const variants: Record<BadgeVariant, string> = {
    gold: 'bg-gold/10 text-gold border-gold/20',
    silver: 'bg-silver/10 text-silver border-silver/20',
    bronze: 'bg-bronze/10 text-bronze border-bronze/20',
    success: 'bg-success/20 text-success-bright border-success-bright/20',
    danger: 'bg-danger/20 text-danger-bright border-danger/20',
    info: 'bg-info/20 text-info-bright border-info-bright/20',
    warning: 'bg-warning/20 text-warning-bright border-warning-bright/20',
    ghost: 'bg-white/5 text-white/40 border-white/10',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-tighter shrink-0 transition-all',
        variants[variant],
        isPulse && 'animate-pulse motion-reduce:animate-none',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
