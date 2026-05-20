import { useLogin } from '@/hooks';
import {
  Input,
  Button,
  Text,
  TEXT_VARIANT,
  Alert,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  WizardLayout,
  FORM,
  ICONS,
  ROUTES,
} from '@/shared';
import { AUTH_UI } from '@/constants';
import { AuthCard } from '@/components/UI/AuthCard';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    handleUsernameChange,
    globalError,
    isSubmitting,
    errors,
  } = useLogin();

  return (
    <WizardLayout title={AUTH_UI.LOGIN.TITLE}>
      <AuthCard title={AUTH_UI.LOGIN.TITLE} onSubmit={handleSubmit}>
        {globalError && <Alert variant="danger">{globalError}</Alert>}

        <div className="space-y-4">
          <Input
            label={FORM.AUTH.LABELS.USERNAME}
            icon="@"
            placeholder={FORM.AUTH.PLACEHOLDERS.USERNAME}
            autoComplete="username"
            disabled={isSubmitting}
            align="center"
            error={errors.username?.message}
            {...register('username', { onChange: handleUsernameChange })}
          />
          <div className="space-y-1">
            <Input
              label={FORM.AUTH.LABELS.PASSWORD}
              type="password"
              icon={ICONS.SECRET}
              placeholder={FORM.AUTH.PLACEHOLDERS.PASSWORD}
              autoComplete="current-password"
              disabled={isSubmitting}
              align="center"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex justify-end px-1">
              <Button
                to={ROUTES.NAV.FORGOT_PASSWORD}
                variant={BUTTON_VARIANT.GHOST}
                size={BUTTON_SIZE.SMALL}
                className="text-gold/40 hover:text-gold text-[9px] tracking-normal p-0 h-auto border-none bg-transparent"
              >
                {AUTH_UI.FORGOT_PASSWORD.TITLE}
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          fullWidth
          className="mt-4"
        >
          {AUTH_UI.LOGIN.SUBMIT}
        </Button>

        <div className="text-center pt-4 border-t border-white/5 mt-4">
          <Text variant={TEXT_VARIANT.MICRO} className="block mb-2">
            {AUTH_UI.LOGIN.NO_ACCOUNT}
          </Text>
          <Button
            to={ROUTES.NAV.REGISTER}
            variant="ghost"
            size="sm"
            className="text-gold"
            aria-label={AUTH_UI.LOGIN.REGISTER_LINK}
          >
            {AUTH_UI.LOGIN.REGISTER_LINK}
          </Button>
        </div>
      </AuthCard>
    </WizardLayout>
  );
};

export default LoginForm;
