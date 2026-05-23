import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input, FORM } from '@/shared';

interface CompetitionNameFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}

export const CompetitionNameField = ({
  register,
  errors,
  disabled = false,
}: CompetitionNameFieldProps) => {
  return (
    <Input
      label={FORM.COMPETITION.LABELS.NAME}
      placeholder={FORM.COMPETITION.PLACEHOLDERS.NAME}
      align="center"
      required
      disabled={disabled}
      error={errors.name?.message as string}
      {...register('name')}
    />
  );
};
