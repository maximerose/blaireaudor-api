import { ROUTES, FORM, AUTH_UI } from '@/constants';
import {
  Input,
  Button,
  AuthCard,
  Alert,
  BUTTON_VARIANT,
} from '@/components/UI';
import { WizardLayout } from '@/components/Layout';
import { useForgotPassword } from '@/hooks';

export const ForgotPasswordForm = () => {
  const { register, handleSubmit, errors, isSuccess, isSubmitting } =
    useForgotPassword();

  return (
    <WizardLayout title={AUTH_UI.FORGOT_PASSWORD.TITLE}>
      <AuthCard
        title={AUTH_UI.FORGOT_PASSWORD.TITLE}
        subtitle={AUTH_UI.FORGOT_PASSWORD.SUBTITLE}
        onSubmit={handleSubmit}
      >
        {isSuccess ? (
          <Alert variant="success">{AUTH_UI.FORGOT_PASSWORD.SUCCESS}</Alert>
        ) : (
          <Input
            label={FORM.AUTH.LABELS.EMAIL}
            type="email"
            icon="@"
            placeholder={FORM.AUTH.PLACEHOLDERS.EMAIL}
            disabled={isSubmitting}
            error={errors?.email?.message}
            {...register('email')}
          />
        )}

        {!isSuccess && (
          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
            className="mt-4"
          >
            {AUTH_UI.FORGOT_PASSWORD.SUBMIT}
          </Button>
        )}

        <div className="flex justify-center pt-4 border-t border-white/5 mt-4">
          <Button
            to={ROUTES.NAV.LOGIN}
            variant={BUTTON_VARIANT.GHOST}
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
