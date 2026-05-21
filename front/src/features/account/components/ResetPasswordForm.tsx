import { useParams } from 'react-router-dom';
import {
  ROUTES,
  FORM,
  Button,
  Alert,
  LoadingScreen,
  WizardLayout,
} from '@/shared';
import { AuthCard } from '@/components/UI/AuthCard';
import { useResetPassword } from '@/features/account/hooks';
import { AUTH_UI } from '@/features/account/constants';
import { PasswordField } from './fields/PasswordField';
import { ConfirmPasswordField } from './fields/ConfirmPasswordField';

export const ResetPasswordForm = () => {
  const { token } = useParams<{ token: string }>();
  const {
    register,
    handleSubmit,
    watch,
    errors,
    isValidating,
    tokenError,
    isSubmitting,
  } = useResetPassword(token);

  const passwordValue = watch('plain_password') || '';

  if (isValidating)
    return <LoadingScreen message={AUTH_UI.RESET_PASSWORD.VALIDATE_LINK} />;

  return (
    <WizardLayout title={AUTH_UI.RESET_PASSWORD.TITLE}>
      <AuthCard
        title={AUTH_UI.RESET_PASSWORD.TITLE}
        subtitle={AUTH_UI.RESET_PASSWORD.SUBTITLE}
        onSubmit={handleSubmit}
      >
        {tokenError ? (
          <Alert variant="danger">{AUTH_UI.RESET_PASSWORD.INVALID_TOKEN}</Alert>
        ) : (
          <div className="space-y-4">
            <PasswordField
              label={FORM.AUTH.LABELS.NEW_PASSWORD}
              disabled={isSubmitting}
              watchValue={passwordValue}
              error={errors.plain_password?.message}
              {...register('plain_password')}
            />

            <ConfirmPasswordField
              disabled={isSubmitting}
              error={errors.confirm_password?.message}
              {...register('confirm_password')}
            />
          </div>
        )}

        {!tokenError && (
          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
            className="mt-4"
          >
            {AUTH_UI.RESET_PASSWORD.SUBMIT}
          </Button>
        )}

        <div className="flex justify-center pt-4 border-t border-white/5 mt-4">
          <Button
            to={ROUTES.NAV.LOGIN}
            variant="ghost"
            size="sm"
            className="text-gold"
          >
            {AUTH_UI.FORGOT_PASSWORD.BACK_TO_LOGIN}
          </Button>
        </div>
      </AuthCard>
    </WizardLayout>
  );
};
