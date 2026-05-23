import React from 'react';
import { FORM, Input } from '@/shared';

interface ActionDateFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const ActionDateField = ({
  error,
  disabled = false,
  ...props
}: ActionDateFieldProps) => {
  return (
    <Input
      type="date"
      label={FORM.SHARED.LABELS.DATE}
      required
      disabled={disabled}
      error={error}
      {...props}
    />
  );
};
