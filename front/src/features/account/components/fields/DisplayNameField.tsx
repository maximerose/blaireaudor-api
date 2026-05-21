import { forwardRef } from 'react';
import { Input, type InputProps, FORM } from '@/shared';

export const DisplayNameField = forwardRef<
  HTMLInputElement,
  Partial<InputProps>
>((props, ref) => (
  <Input
    ref={ref}
    label={FORM.AUTH.LABELS.DISPLAY_NAME}
    placeholder={FORM.AUTH.PLACEHOLDERS.DISPLAY_NAME}
    required
    {...props}
  />
));

DisplayNameField.displayName = 'DisplayNameField';
