import React from 'react';

type CardVariant = 'default' | 'dark' | 'glass';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  variant?: CardVariant;
  onClick?: () => void;
}

export const Card = ({
  children,
  className = '',
  isHoverable = false,
  variant = 'default',
  onClick,
}: CardProps) => {
  const variants: Record<CardVariant, string> = {
    default: 'bg-dark-lighter/40 border-gold/10',
    dark: 'bg-black/40 border-white/5',
    glass: 'bg-white/5 border-white/10 backdrop-blur-md',
  };

  const baseStyles = 'border rounded-2xl shadow-xl transition-all duration-300';

  const hoverStyles = isHoverable
    ? 'hover:border-gold/30 hover:bg-gold/[0.02] hover:shadow-gold/5'
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
