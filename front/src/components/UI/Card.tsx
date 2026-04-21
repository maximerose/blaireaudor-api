import type React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  variant?: 'default' | 'dark' | 'glass';
}

export const Card = ({
  children,
  className = '',
  isHoverable = false,
  variant = 'default',
}: CardProps) => {
  const variants = {
    default: 'bg-black/40 border-gold/20',
    dark: 'bg-black/20 border-gold/10',
    glass: 'bg-white/5 border-white/10 backdrop-blur-sm',
  };
  const baseStyles = 'border rounded-2xl shadow-lg transition-all duration-300';
  const hoverStyles = isHoverable
    ? 'hover:border-gold/50 hover:shadow-gold/5'
    : '';

  return (
    <div
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
