import React from 'react';
import { FORM, Input } from '@/shared';

interface ActionDescriptionFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const ActionDescriptionField = ({
  error,
  disabled = false,
  ...props
}: ActionDescriptionFieldProps) => {
  return (
    <Input
      label={FORM.REPORT_ACTION.LABELS.DESCRIPTION}
      placeholder={FORM.REPORT_ACTION.PLACEHOLDERS.DESCRIPTION}
      required
      disabled={disabled}
      error={error}
      {...props}
    />
  );
};
