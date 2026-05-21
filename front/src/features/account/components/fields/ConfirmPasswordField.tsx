import { forwardRef } from 'react';
import { Input, type InputProps, FORM, ICONS } from '@/shared';

export const ConfirmPasswordField = forwardRef<
  HTMLInputElement,
  Partial<InputProps>
>((props, ref) => (
  <Input
    ref={ref}
    type="password"
    label={FORM.AUTH.LABELS.CONFIRM_PASSWORD}
    icon={ICONS.CHECK}
    placeholder={FORM.AUTH.PLACEHOLDERS.PASSWORD}
    required
    {...props}
  />
));

ConfirmPasswordField.displayName = 'ConfirmPasswordField';
