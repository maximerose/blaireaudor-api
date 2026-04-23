import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  to?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  className = '',
  disabled,
  to,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark outline-none';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-gold text-black hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] shadow-lg shadow-gold/5',
    secondary:
      'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20',
    danger:
      'bg-danger/20 border border-danger/30 text-danger-bright hover:bg-danger hover:text-white transition-colors duration-500',
    ghost:
      'text-gold/50 hover:text-gold hover:bg-gold/5 border border-transparent',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-[9px]',
    md: 'px-6 py-2 text-[10px]',
    lg: 'px-8 py-4 text-xs',
  };

  const combinedClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <>
          <div
            className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span className="sr-only">Action en cours...</span>
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {icon && (
            <span className="text-base" aria-hidden="true">
              {icon}
            </span>
          )}
          {children}
        </>
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={combinedClasses}
        aria-disabled={disabled || isLoading}
        onClick={disabled || isLoading ? (e) => e.preventDefault() : undefined}
        role="link"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type || 'button'}
      className={combinedClasses}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      {content}
    </button>
  );
};
