import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
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
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary: 'bg-gold text-black hover:bg-white shadow-lg shadow-gold/10',
    secondary:
      'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white',
    danger:
      'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white',
    ghost:
      'text-gold/50 hover:text-gold hover:bg-gold/5 border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[9px]',
    md: 'px-6 py-3 text-[10px]',
    lg: 'px-8 py-4 text-xs',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Chargement...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          {children}
        </div>
      )}
    </button>
  );
};
