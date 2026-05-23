import {
  Input,
  Button,
  Alert,
  BUTTON_VARIANT,
  WizardLayout,
  FORM,
  ROUTES,
  WizardCard,
  CARD_VARIANT,
  Stack,
  Row,
  Divider,
} from '@/shared';
import { useForgotPassword } from '@/features/account/hooks';
import { AUTH_UI } from '@/features/account/constants';

export const ForgotPasswordForm = () => {
  const { register, handleSubmit, errors, isSuccess, isSubmitting } =
    useForgotPassword();

  return (
    <WizardLayout title={AUTH_UI.FORGOT_PASSWORD.TITLE}>
      <WizardCard
        as="form"
        variant={CARD_VARIANT.GLASS}
        title={AUTH_UI.FORGOT_PASSWORD.TITLE}
        subtitle={AUTH_UI.FORGOT_PASSWORD.SUBTITLE}
        onSubmit={handleSubmit}
        noValidate
      >
        {isSuccess ? (
          <Alert variant="success">{AUTH_UI.FORGOT_PASSWORD.SUCCESS}</Alert>
        ) : (
          <Stack gap="md">
            <Input
              label={FORM.AUTH.LABELS.EMAIL}
              type="email"
              icon="@"
              placeholder={FORM.AUTH.PLACEHOLDERS.EMAIL}
              disabled={isSubmitting}
              error={errors?.email?.message}
              {...register('email')}
            />
            <Button type="submit" isLoading={isSubmitting} fullWidth>
              {AUTH_UI.FORGOT_PASSWORD.SUBMIT}
            </Button>
          </Stack>
        )}

        <Divider spacing="md" />

        <Row justify="center">
          <Button
            to={ROUTES.NAV.LOGIN}
            variant={BUTTON_VARIANT.GHOST}
            size="sm"
            className="text-gold"
          >
            {AUTH_UI.FORGOT_PASSWORD.BACK_TO_LOGIN}
          </Button>
        </Row>
      </WizardCard>
    </WizardLayout>
  );
};
