import { useLogin } from '@/hooks';
import { ROUTES, ICONS, FORM, AUTH_UI } from '@/constants';
import { Input, Button, AuthCard, Text, TEXT_VARIANT } from '@/components/UI';

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
    <AuthCard
      title={AUTH_UI.LOGIN.TITLE}
      subtitle={AUTH_UI.LOGIN.SUBTITLE}
      onSubmit={handleSubmit}
    >
      {globalError && (
        <div
          className="bg-danger/10 border border-danger-bright/20 p-3 rounded-xl animate-pulse motion-reduce:animate-none"
          role="alert"
        >
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="text-danger-bright text-center opacity-100"
          >
            <span aria-hidden="true">{ICONS.DANGER} </span>
            {globalError}
          </Text>
        </div>
      )}

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
      </div>

      <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-4">
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
  );
};

export default LoginForm;
