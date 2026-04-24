import React from 'react';
import { cn } from '@/utils';

type CardVariant = 'default' | 'dark' | 'glass';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  variant?: CardVariant;
  as?: React.ElementType;
}

const CARD_VARIANTS: Record<CardVariant, string> = {
  default: 'bg-dark-lighter/40 border-gold/10',
  dark: 'bg-black/40 border-white/5',
  glass: 'bg-white/5 border-white/10 backdrop-blur-md',
};

const BASE_STYLES = 'border rounded-2xl shadow-xl transition-default';

export const Card = ({
  as: Component = 'div',
  children,
  className = '',
  isHoverable = false,
  variant = 'default',
  onClick,
  ...props
}: CardProps) => {
  const isClickable = !!onClick;
  const shouldHover = isHoverable || isClickable;

  const hoverStyles = shouldHover
    ? 'hover:border-gold/30 hover:bg-gold/[0.02] hover:shadow-gold/5'
    : '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e as any);
    }
  };

  return (
    <Component
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={cn(
        BASE_STYLES,
        CARD_VARIANTS[variant],
        hoverStyles,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
