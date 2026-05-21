import { forwardRef } from 'react';
import {
  Input,
  type InputProps,
  Text,
  TEXT_VARIANT,
  FORM,
  ICONS,
  AVAILABILITY,
} from '@/shared';

interface UsernameFieldProps extends Partial<InputProps> {
  usernameStatus: string | null;
  usernameLoading: boolean;
  isUsernameUnchanged?: boolean;
  showHint?: boolean;
}

export const UsernameField = forwardRef<HTMLInputElement, UsernameFieldProps>(
  (
    {
      usernameStatus,
      usernameLoading,
      isUsernameUnchanged = false,
      showHint = false,
      error,
      ...props
    },
    ref,
  ) => (
    <div className="space-y-1 w-full">
      <Input
        ref={ref}
        label={FORM.AUTH.LABELS.USERNAME}
        icon="@"
        placeholder={FORM.AUTH.PLACEHOLDERS.USERNAME}
        required
        autoComplete="username"
        error={error}
        {...props}
      />

      {showHint && !error && (
        <Text
          variant={TEXT_VARIANT.MICRO}
          className="px-1 italic text-gold/60 block"
        >
          <span aria-hidden="true">{ICONS.HINT} </span>{' '}
          {FORM.AUTH.HINTS.USERNAME_HINT}
        </Text>
      )}

      <div className="h-4 flex justify-center" aria-live="polite">
        {!isUsernameUnchanged && usernameStatus && (
          <>
            {usernameLoading ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-gold animate-pulse text-center"
              >
                {FORM.AUTH.HINTS.USERNAME_CHECK}
              </Text>
            ) : usernameStatus === AVAILABILITY.AVAILABLE ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-success-bright text-center"
              >
                <span className="mr-1">{ICONS.SUCCESS}</span>{' '}
                {FORM.AUTH.HINTS.USERNAME_AVAILABLE}
              </Text>
            ) : usernameStatus === AVAILABILITY.TAKEN ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-danger-bright text-center"
              >
                <span className="mr-1">{ICONS.FAILURE}</span>{' '}
                {FORM.AUTH.HINTS.USERNAME_TAKEN}
              </Text>
            ) : null}
          </>
        )}
      </div>
    </div>
  ),
);

UsernameField.displayName = 'UsernameField';
