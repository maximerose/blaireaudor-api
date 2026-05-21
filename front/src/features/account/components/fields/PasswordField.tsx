import { forwardRef } from 'react';
import { Input, type InputProps, FORM, ICONS } from '@/shared';
import { PasswordStrength } from '../PasswordStrength';

interface PasswordFieldProps extends Partial<InputProps> {
  watchValue?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      label = FORM.AUTH.LABELS.PASSWORD,
      icon = ICONS.SECRET,
      watchValue,
      error,
      ...props
    },
    ref,
  ) => (
    <div className="space-y-1 w-full">
      <Input
        ref={ref}
        type="password"
        label={label}
        icon={icon}
        placeholder={FORM.AUTH.PLACEHOLDERS.PASSWORD}
        required
        error={error}
        {...props}
      />
      {watchValue && watchValue.length > 0 && !error && (
        <PasswordStrength password={watchValue} />
      )}
    </div>
  ),
);

PasswordField.displayName = 'PasswordField';
