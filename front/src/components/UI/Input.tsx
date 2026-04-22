import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  align?: 'left' | 'center';
}

export const Input = ({
  label,
  icon,
  align = 'center',
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          className={`block text-gold/50 text-[9px] font-black uppercase tracking-[0.2em] ml-1 ${align === 'center' ? 'text-center' : 'text-left'}`}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center group">
        {icon && (
          <span className="absolute left-4 text-gold/30 group-focus-within:text-gold transition-colors text-xs">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`
            w-full bg-black/20 border border-gold/10 text-gold rounded-xl 
            px-2 sm:px-4
            py-2 sm:py-2.5
            placeholder:text-gold/10 text-[11px] sm:text-sm transition-all duration-300 truncate text-ellipsis overflow-hidden
            focus:outline-none focus:border-gold/40 focus:ring-4 focus:ring-gold/5
            disabled:opacity-60
            ${align === 'center' ? 'text-center' : 'text-left pl-10'}
            ${className}
          `}
        />
      </div>
    </div>
  );
};
