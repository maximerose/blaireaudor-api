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

interface EmailFieldProps extends Partial<InputProps> {
  emailStatus: string | null;
  emailLoading: boolean;
  isEmailUnchanged?: boolean;
}

export const EmailField = forwardRef<HTMLInputElement, EmailFieldProps>(
  (
    { emailStatus, emailLoading, isEmailUnchanged = false, error, ...props },
    ref,
  ) => (
    <div className="space-y-1 w-full">
      <Input
        ref={ref}
        label={FORM.AUTH.LABELS.EMAIL}
        type="email"
        icon={ICONS.SEARCH}
        placeholder={FORM.AUTH.PLACEHOLDERS.EMAIL}
        required
        autoComplete="email"
        error={error}
        {...props}
      />

      <div className="h-4 flex justify-center" aria-live="polite">
        {!isEmailUnchanged && emailStatus && (
          <>
            {emailLoading ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-gold animate-pulse text-center"
              >
                {FORM.AUTH.HINTS.EMAIL_CHECK}
              </Text>
            ) : emailStatus === AVAILABILITY.AVAILABLE ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-success-bright text-center"
              >
                <span className="mr-1">{ICONS.SUCCESS}</span>{' '}
                {FORM.AUTH.HINTS.EMAIL_AVAILABLE}
              </Text>
            ) : emailStatus === AVAILABILITY.TAKEN ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-danger-bright text-center"
              >
                <span className="mr-1">{ICONS.FAILURE}</span>{' '}
                {FORM.AUTH.HINTS.EMAIL_TAKEN}
              </Text>
            ) : null}
          </>
        )}
      </div>
    </div>
  ),
);

EmailField.displayName = 'EmailField';
