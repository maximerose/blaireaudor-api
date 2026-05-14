import React, { forwardRef, useId } from 'react';
import { Text, TEXT_VARIANT } from '@/components/UI';
import { useInputUI } from '@/hooks';
import { cn } from '@/utils';

// ==========================================
// 1. COMPOSANT LABEL GÉNÉRIQUE (Pour unifier ton text-gold)
// ==========================================
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = ({
  children,
  required,
  className,
  ...props
}: LabelProps) => (
  <Text
    as="label"
    variant={TEXT_VARIANT.CAPTION}
    className={cn('text-gold tracking-widest uppercase pl-1 block', className)}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-1 text-danger-bright" aria-hidden="true">
        *
      </span>
    )}
  </Text>
);

// ==========================================
// 2. COMPOSANT INPUT UNIFIÉ (Gère Date, Time, Text...)
// ==========================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string | React.ReactNode;
  renderRight?: React.ReactNode;
  align?: 'left' | 'center';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon,
      renderRight,
      align = 'center',
      className = '',
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const { labelClasses, inputClasses } = useInputUI(inputId, {
      align,
      icon,
      className,
    });

    const isDateOrTime = props.type === 'date' || props.type === 'time';

    const shadowDomClasses = isDateOrTime
      ? cn(
          '[color-scheme:dark]',
          align === 'center' &&
            cn(
              '[&::-webkit-datetime-edit]:block [&::-webkit-datetime-edit]:text-center',
              '[&::-webkit-datetime-edit-fields-wrapper]:inline-flex [&::-webkit-datetime-edit-fields-wrapper]:justify-center [&::-webkit-datetime-edit-fields-wrapper]:w-full pl-5',
              '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4',
              '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
              '[&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:sepia-[1] [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[10deg] [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-opacity',
            ),
        )
      : '';

    return (
      <div className="w-full space-y-1">
        {/* Rétrocompatibilité : si on passe un label en prop, on utilise notre nouveau composant Label */}
        {label && (
          <Label
            htmlFor={inputId}
            required={props.required}
            className={labelClasses}
          >
            {label}
          </Label>
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

          <input
            ref={ref}
            id={inputId}
            {...props}
            className={cn(inputClasses, shadowDomClasses)}
          />

          {renderRight && (
            <div className="absolute right-2 h-full top-1/2 -translate-y-1/2 flex items-center">
              {renderRight}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';
