import { useEmailCheck } from '@/features/account/hooks';
import {
  AVAILABILITY,
  FORM,
  ICONS,
  Input,
  Row,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';

interface EmailFieldProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
  initialEmail?: string;
  fieldName?: string;
  disabled?: boolean;
}

export const EmailField = ({
  register,
  watch,
  errors,
  initialEmail = '',
  fieldName = 'email',
  disabled = false,
}: EmailFieldProps) => {
  const currentEmail = watch(fieldName);

  const { emailStatus, emailLoading } = useEmailCheck(currentEmail);

  const isEmailChanged = currentEmail && currentEmail !== initialEmail;
  const error = errors[fieldName]?.message as string;

  return (
    <Stack gap="xs" className="w-full">
      <Input
        label={FORM.AUTH.LABELS.EMAIL}
        type="email"
        icon={ICONS.SEARCH}
        placeholder={FORM.AUTH.PLACEHOLDERS.EMAIL}
        required
        disabled={disabled}
        autoComplete="email"
        error={error}
        {...register(fieldName, {
          onChange: (e) => {
            e.target.value = e.target.value.toLowerCase().trim();
          },
        })}
      />

      {isEmailChanged && !error && (
        <Row justify="center" className="h-4" aria-live="polite">
          {emailLoading ? (
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.GOLD}
              className="animate-pulse text-center"
            >
              {FORM.AUTH.HINTS.EMAIL_CHECK}
            </Text>
          ) : emailStatus === AVAILABILITY.AVAILABLE ? (
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.SUCCESS}
              className="flex items-center justify-center gap-1 text-center" // 🟢 Alignement Flex injecté
            >
              <span aria-hidden="true" className="flex items-center">
                {ICONS.SUCCESS}
              </span>
              {FORM.AUTH.HINTS.EMAIL_AVAILABLE}
            </Text>
          ) : emailStatus === AVAILABILITY.TAKEN ? (
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.DANGER}
              className="flex items-center justify-center gap-1 text-center" // 🟢 Alignement Flex injecté
            >
              <span aria-hidden="true" className="flex items-center">
                {ICONS.FAILURE}
              </span>
              {FORM.AUTH.HINTS.EMAIL_TAKEN}
            </Text>
          ) : null}
        </Row>
      )}
    </Stack>
  );
};
