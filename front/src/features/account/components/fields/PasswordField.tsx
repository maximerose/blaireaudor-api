import { FORM, ICONS, Input, Stack, type InputProps } from '@/shared';
import { forwardRef } from 'react';
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
      hideAsterisk = false,
      ...props
    },
    ref,
  ) => (
    <Stack gap="none" className="w-full">
      <Input
        ref={ref}
        type="password"
        label={label}
        icon={icon}
        placeholder={FORM.AUTH.PLACEHOLDERS.PASSWORD}
        hideAsterisk={hideAsterisk}
        error={error}
        {...props}
      />
      {watchValue && watchValue.length > 0 && !error && (
        <PasswordStrength password={watchValue} />
      )}
    </Stack>
  ),
);

PasswordField.displayName = 'PasswordField';
