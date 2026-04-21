import type React from 'react';

export type BadgeVariant = 'gold' | 'success' | 'danger' | 'info' | 'ghost';

interface BadgeProps {
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
}: BadgeProps) => {
  const variants = {
    gold: 'bg-gold/10 text-gold border-gold/20',
    success: 'bg-green-500/20 text-green-500 border-green-500/30',
    danger: 'bg-red-500/20 text-red-500 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
    ghost: 'bg-white/5 text-white/40 border-white/10',
  };

  return (
    <span
      className={`
      px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-tighter shrink-0
      ${variants[variant]}
      ${isPulse ? 'animate-pulse' : ''}
      ${className}
    `}
    >
      {children}
    </span>
  );
};
