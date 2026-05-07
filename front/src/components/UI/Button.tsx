import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';

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

const BASE_STYLES =
  'inline-flex items-center justify-center font-black uppercase tracking-widest transition-default rounded-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark outline-none shrink-0';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-gold text-black hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] shadow-lg shadow-gold/5',
  secondary:
    'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20',
  danger:
    'bg-danger/20 border border-danger/30 text-danger-bright hover:bg-danger hover:text-white transition-slow',
  ghost:
    'text-gold/50 hover:text-gold hover:bg-gold/5 border border-transparent',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[9px]',
  md: 'px-6 py-2 text-[10px]',
  lg: 'px-8 py-4 text-xs',
};

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
  const combinedClasses = cn(
    BASE_STYLES,
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <div className="flex items-center justify-center gap-2">
      {isLoading && (
        <div
          className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"
          aria-hidden="true"
        />
      )}
      {!isLoading && icon && (
        <span
          className="flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="leading-none pt-0.5">
        {isLoading ? 'Chargement...' : children}
      </span>
    </div>
  );

  if (to) {
    const isLinkDisabled = disabled || isLoading;
    return (
      <Link
        to={isLinkDisabled ? '#' : to}
        className={cn(combinedClasses, isLinkDisabled && 'pointer-events-none')}
        aria-disabled={isLinkDisabled}
        role="link"
        tabIndex={isLinkDisabled ? -1 : 0}
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
