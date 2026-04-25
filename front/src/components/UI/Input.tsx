import React from 'react';
import { Text } from '@/components/UI';
import { useInputUI } from '@/hooks';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string | React.ReactNode;
  renderRight?: React.ReactNode;
  align?: 'left' | 'center';
}

export const Input = ({
  label,
  icon,
  renderRight,
  align = 'center',
  className = '',
  id,
  ...props
}: InputProps) => {
  const { inputId, labelClasses, inputClasses } = useInputUI(id, {
    align,
    icon,
    className: className,
  });

  return (
    <div className="w-full space-y-1">
      {label && (
        <Text
          as="label"
          htmlFor={inputId}
          variant="caption"
          className={labelClasses}
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
            className="absolute left-4 text-gold/30 group-focus-within:text-gold transition-default text-xs pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input id={inputId} {...props} className={inputClasses} />

        {renderRight && (
          <div className="absolute right-2 h-full top-1/2 -translate-y-1/2 flex items-center">
            {renderRight}
          </div>
        )}
      </div>
    </div>
  );
};
