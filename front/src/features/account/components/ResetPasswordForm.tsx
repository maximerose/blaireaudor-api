import { useParams } from 'react-router-dom';
import {
  ROUTES,
  FORM,
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  Alert,
  LoadingScreen,
  WizardLayout,
  WizardCard,
  CARD_VARIANT,
  Row,
  Divider,
} from '@/shared';
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
      <WizardCard
        as="form"
        variant={CARD_VARIANT.GLASS}
        title={AUTH_UI.RESET_PASSWORD.TITLE}
        subtitle={AUTH_UI.RESET_PASSWORD.SUBTITLE}
        onSubmit={handleSubmit}
        noValidate
      >
        {tokenError ? (
          <Alert variant="danger">{AUTH_UI.RESET_PASSWORD.INVALID_TOKEN}</Alert>
        ) : (
          <>
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

            <Button type="submit" isLoading={isSubmitting} fullWidth>
              {AUTH_UI.RESET_PASSWORD.SUBMIT}
            </Button>
          </>
        )}

        <Divider spacing="md" />

        <Row justify="center">
          <Button
            to={ROUTES.NAV.LOGIN}
            variant={BUTTON_VARIANT.GHOST}
            size={BUTTON_SIZE.SMALL}
          >
            {AUTH_UI.FORGOT_PASSWORD.BACK_TO_LOGIN}
          </Button>
        </Row>
      </WizardCard>
    </WizardLayout>
  );
};
