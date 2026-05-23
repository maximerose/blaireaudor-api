import React from 'react';
import { FORM, Input } from '@/shared';

interface ActionPointsFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const ActionPointsField = ({
  error,
  disabled = false,
  ...props
}: ActionPointsFieldProps) => {
  return (
    <Input
      type="number"
      label={FORM.REPORT_ACTION.LABELS.POINTS}
      placeholder={FORM.REPORT_ACTION.PLACEHOLDERS.POINTS}
      required
      step="10"
      disabled={disabled}
      error={error}
      {...props}
    />
  );
};
