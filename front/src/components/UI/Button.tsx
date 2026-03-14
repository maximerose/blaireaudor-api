// front/src/components/UI/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  isLoading,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClass = `font-bold rounded-lg transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 ${
    fullWidth ? 'w-full' : 'w-auto'
  } px-4 py-2`;

  const stateClass =
    isLoading || props.disabled
      ? 'bg-gold/50 cursor-not-allowed opacity-70 text-dark/50'
      : 'bg-gold text-dark hover:bg-gold/90 active:scale-95 cursor-pointer';

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${baseClass} ${stateClass} ${className}`}
    >
      {isLoading && (
        <div className="w-3 h-3 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
