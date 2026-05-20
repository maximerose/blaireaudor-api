import React from 'react';
import { cn } from '@/shared/utils';

export const CARD_VARIANT = {
  DEFAULT: 'default',
  DARK: 'dark',
  GLASS: 'glass',
} as const;

export type CardVariant = (typeof CARD_VARIANT)[keyof typeof CARD_VARIANT];

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  variant?: CardVariant;
  as?: React.ElementType;
}

const CARD_STYLES: Record<CardVariant, string> = {
  [CARD_VARIANT.DEFAULT]: 'bg-dark-lighter/40 border-gold/10',
  [CARD_VARIANT.DARK]: 'bg-black/40 border-white/5',
  [CARD_VARIANT.GLASS]: 'bg-white/5 border-white/10 backdrop-blur-md',
};

const BASE_STYLES = 'border rounded-2xl shadow-xl transition-default';

export const Card = ({
  as: Tag = 'div',
  children,
  className = '',
  isHoverable = false,
  variant = CARD_VARIANT.DEFAULT,
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
    <Tag
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={cn(BASE_STYLES, CARD_STYLES[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
