import { useUsernameCheck } from '@/features/account/hooks';
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

interface UsernameFieldProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
  initialUsername?: string;
  currentPlayerId?: string | null;
  fieldName?: string;
  showHint?: boolean;
  disabled?: boolean;
  registerOptions?: Record<string, any>;
}

export const UsernameField = ({
  register,
  watch,
  errors,
  initialUsername = '',
  currentPlayerId = null,
  fieldName = 'username',
  showHint = false,
  disabled = false,
  registerOptions = {},
}: UsernameFieldProps) => {
  const currentUsername = watch(fieldName);

  const { usernameStatus, usernameLoading, shouldShowFeedback } =
    useUsernameCheck(currentUsername, currentPlayerId, initialUsername);

  const error = errors[fieldName]?.message as string;

  return (
    <Stack gap="sm" className="w-full">
      <Input
        label={FORM.AUTH.LABELS.USERNAME}
        icon="@"
        placeholder={FORM.AUTH.PLACEHOLDERS.USERNAME}
        required
        disabled={disabled}
        autoComplete="username"
        error={error}
        {...register('username', registerOptions)}
      />

      {showHint && !error && (
        <Text
          variant={TEXT_VARIANT.MICRO}
          colorTheme={TEXT_THEME.GOLD}
          className="px-1 italic opacity-60 flex items-center gap-1" // 🟢 Alignement Flex injecté
        >
          <span aria-hidden="true" className="flex items-center">
            {ICONS.HINT}
          </span>
          {FORM.AUTH.HINTS.USERNAME_HINT}
        </Text>
      )}

      {shouldShowFeedback && (
        <Row justify="center" className="h-4" aria-live="polite">
          {usernameLoading ? (
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.GOLD}
              className="animate-pulse text-center"
            >
              {FORM.AUTH.HINTS.USERNAME_CHECK}
            </Text>
          ) : usernameStatus === AVAILABILITY.AVAILABLE ? (
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.SUCCESS}
              className="flex items-center justify-center gap-1 text-center" // 🟢 Alignement Flex injecté
            >
              <span aria-hidden="true" className="flex items-center">
                {ICONS.SUCCESS}
              </span>
              {FORM.AUTH.HINTS.USERNAME_AVAILABLE}
            </Text>
          ) : usernameStatus === AVAILABILITY.TAKEN ||
            usernameStatus === AVAILABILITY.GUEST_EXISTS ? (
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.DANGER}
              className="flex items-center justify-center gap-1 text-center" // 🟢 Alignement Flex injecté
            >
              <span aria-hidden="true" className="flex items-center">
                {ICONS.FAILURE}
              </span>
              {FORM.AUTH.HINTS.USERNAME_TAKEN}
            </Text>
          ) : null}
        </Row>
      )}
    </Stack>
  );
};
