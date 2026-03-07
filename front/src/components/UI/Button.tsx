import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = ({
  children,
  isLoading,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClass =
    'w-full py-3 font-bold rounded-lg transition-all shadow-lg shadow-gold/20';
  const stateClass = isLoading
    ? 'bg-gold/50 cursor-not-allowed opacity-70'
    : 'bg-gold text-dark hover:bg-gold/90 active:scale-95 cursor-pointer';

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${baseClass} ${stateClass} ${className}`}
    >
      {children}
    </button>
  );
};
