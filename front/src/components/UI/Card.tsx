import React from 'react';
import { cn } from '../../utils/cn';

type CardVariant = 'default' | 'dark' | 'glass';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  variant?: CardVariant;
}

export const Card = ({
  children,
  className = '',
  isHoverable = false,
  variant = 'default',
  onClick,
  ...props
}: CardProps) => {
  const variants: Record<CardVariant, string> = {
    default: 'bg-dark-lighter/40 border-gold/10',
    dark: 'bg-black/40 border-white/5',
    glass: 'bg-white/5 border-white/10 backdrop-blur-md',
  };

  const baseStyles = 'border rounded-2xl shadow-xl transition-all duration-300';
  const isClickable = !!onClick;
  const shouldHover = isHoverable || isClickable;
  const hoverStyles = shouldHover
    ? 'hover:border-gold/30 hover:bg-gold/[0.02] hover:shadow-gold/5'
    : '';

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e as any);
              }
            }
          : undefined
      }
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
};
