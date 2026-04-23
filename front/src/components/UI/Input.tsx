import React, { useId } from 'react';
import { Text } from './Typography';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string | React.ReactNode;
  align?: 'left' | 'center';
}

export const Input = ({
  label,
  icon,
  align = 'center',
  className = '',
  id,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full space-y-1">
      {label && (
        <Text
          as="label"
          htmlFor={inputId}
          variant="caption"
          className={cn(
            'block text-gold ml-1 cursor-pointer font-bold uppercase tracking-wider',
            align === 'center' ? 'text-center' : 'text-left',
          )}
        >
          {label}
          {props.required && (
            <span className="ml-1 text-danger-bright" aria-hidden="true">
              *
            </span>
          )}
        </Text>
      )}
      <div className="relative flex items-center group">
        {icon && (
          <span
            className="absolute left-4 text-gold/30 group-focus-within:text-gold transition-colors text-xs pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          {...props}
          className={cn(
            'w-full bg-black/20 border border-gold/10 text-gold rounded-xl',
            'py-2 sm:py-2.5 pr-2 sm:pr-4',
            'placeholder:text-gold/20 text-[11px] sm:text-sm transition-all duration-300 truncate text-ellipsis overflow-hidden',
            'focus:outline-none focus:border-gold/40 focus:ring-4 focus:ring-gold/5',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            align === 'center' ? 'text-center' : 'text-left',
            icon ? 'pl-10' : 'pl-4',
            className,
          )}
        />
      </div>
    </div>
  );
};
