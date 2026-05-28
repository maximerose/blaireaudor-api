import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Input, FORM } from '@/shared';

interface CompetitionNameFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
}

export const CompetitionNameField = <T extends FieldValues>({
  register,
  errors,
  disabled = false,
}: CompetitionNameFieldProps<T>) => {
  return (
    <Input
      label={FORM.COMPETITION.LABELS.NAME}
      placeholder={FORM.COMPETITION.PLACEHOLDERS.NAME}
      align="center"
      required
      disabled={disabled}
      error={errors.name?.message as string}
      {...register('name' as Path<T>)}
    />
  );
};
