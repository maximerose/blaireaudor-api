import { ICONS } from '@/shared/constants';
import { useInputUI } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import React, { forwardRef } from 'react';
import { Stack } from '../Layout/Stack';
import { Text, TEXT_THEME, TEXT_VARIANT } from './Text';

// ==========================================
// 1. COMPOSANT LABEL GÉNÉRIQUE
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
    colorTheme={TEXT_THEME.GOLD}
    className={className}
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
// 2. COMPOSANT INPUT UNIFIÉ
// ==========================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string | React.ReactNode;
  renderRight?: React.ReactNode;
  align?: 'left' | 'center';
  error?: string;
  hideAsterisk?: boolean;
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
      onChange,
      hideAsterisk = false,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    const { inputId, labelClasses, inputClasses } = useInputUI(id, {
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
      <Stack gap="xs" className="w-full">
        {label && (
          <Label
            htmlFor={inputId}
            required={hideAsterisk ? false : props.required}
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
                  : 'text-text-dimmed group-focus-within:text-gold',
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
            onChange={handleChange}
            {...props}
            className={cn(
              inputClasses,
              shadowDomClasses,
              error &&
                'border-danger-border focus:border-danger-bright focus:shadow-[0_0_10px_rgba(248,113,113,0.15)]',
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
            colorTheme={TEXT_THEME.DANGER}
            className="text-center animate-fade-in flex items-center justify-center gap-1" // 🟢 Remplacement par flexbox
          >
            <span aria-hidden="true" className="flex items-center">
              {ICONS.DANGER}
            </span>
            {error}
          </Text>
        )}
      </Stack>
    );
  },
);

Input.displayName = 'Input';
