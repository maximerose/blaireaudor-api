import React, { forwardRef, useId } from 'react';
import { Text, TEXT_VARIANT } from '@/shared/components/UI';
import { useInputUI } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { ICONS } from '@/shared/constants';

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
  error?: string;
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
      error,
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
              className={cn(
                'absolute left-4 text-xs pointer-events-none transition-default',
                error
                  ? 'text-danger-bright'
                  : 'text-gold/30 group-focus-with:text-gold',
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            {...props}
            className={cn(
              inputClasses,
              shadowDomClasses,
              error &&
                'border-danger-bright focus:border-danger-bright focus:ring-danger/10',
            )}
          />

          {renderRight && (
            <div className="absolute right-2 h-full top-1/2 -translate-y-1/2 flex items-center">
              {renderRight}
            </div>
          )}
        </div>

        {error && (
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="text-danger-bright text-center animate-fade-in block mt-1"
          >
            <span aria-hidden="true">{ICONS.DANGER} </span>
            {error}
          </Text>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
