import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

export const Input = ({
  label,
  icon,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gold/80 text-sm mb-1 ml-1">{label}</label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-4 text-gold/50 pointer-events-none text-sm">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-center placeholder-gold/20 ${className}`}
        />
      </div>
    </div>
  );
};
