import { useLogin } from '@/hooks';
import { ROUTES, ICONS, FORM, AUTH_UI } from '@/constants';
import { Input, Button, AuthCard, Text, TEXT_VARIANT } from '@/components/UI';
import { preventDefault } from '@/utils';

export const LoginForm = () => {
  const { credentials, error, isLoading, handleChange, handleSubmit } =
    useLogin();

  return (
    <AuthCard
      title={AUTH_UI.LOGIN.TITLE}
      onSubmit={preventDefault(handleSubmit)}
    >
      <Text
        variant={TEXT_VARIANT.CAPTION}
        className="text-gold/50 mb-6 block text-center"
      >
        {AUTH_UI.LOGIN.SUBTITLE}
      </Text>

      {error && (
        <div
          className="bg-danger/10 border border-danger-bright/20 p-3 rounded-xl animate-pulse motion-reduce:animate-none"
          role="alert"
        >
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="text-danger-bright text-center opacity-100"
          >
            <span aria-hidden="true">{ICONS.DANGER} </span>
            {error}
          </Text>
        </div>
      )}

      <div className="space-y-4">
        <Input
          name="username"
          label={FORM.AUTH.LABELS.USERNAME}
          icon="@"
          placeholder={FORM.AUTH.PLACEHOLDERS.USERNAME}
          autoComplete="username"
          value={credentials.username}
          onChange={handleChange}
          disabled={isLoading}
          required
          align="center"
        />

        <Input
          name="password"
          label={FORM.AUTH.LABELS.PASSWORD}
          type="password"
          icon={ICONS.SECRET}
          placeholder={FORM.AUTH.PLACEHOLDERS.PASSWORD}
          autoComplete="current-password"
          value={credentials.password}
          onChange={handleChange}
          disabled={isLoading}
          required
          align="center"
        />
      </div>

      <Button type="submit" isLoading={isLoading} fullWidth className="mt-4">
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
