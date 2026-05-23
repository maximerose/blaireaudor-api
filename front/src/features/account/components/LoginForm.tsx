import { Link } from 'react-router-dom';
import {
  Input,
  Button,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Alert,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  WizardLayout,
  FORM,
  ROUTES,
  WizardCard,
  CARD_VARIANT,
  Stack,
  Row,
  Divider,
} from '@/shared';
import { useLogin } from '@/features/account/hooks';
import { AUTH_UI } from '@/features/account/constants';
import { PasswordField } from './fields/PasswordField';

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
      <WizardCard
        as="form"
        variant={CARD_VARIANT.GLASS}
        title={AUTH_UI.LOGIN.TITLE}
        onSubmit={handleSubmit}
        noValidate
      >
        {globalError && <Alert variant="danger">{globalError}</Alert>}

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

        <Stack gap="xs">
          <PasswordField
            label={FORM.AUTH.LABELS.PASSWORD}
            autoComplete="current-password"
            disabled={isSubmitting}
            align="center"
            error={errors.password?.message}
            {...register('password')}
          />

          <Row justify="end">
            <Link
              to={ROUTES.NAV.FORGOT_PASSWORD}
              className="outline-none group"
            >
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.GOLD}
                className="opacity-40 group-hover:opacity-100 group-focus-visible:underline transition-default tracking-normal"
              >
                {AUTH_UI.FORGOT_PASSWORD.TITLE}
              </Text>
            </Link>
          </Row>
        </Stack>

        <Button type="submit" isLoading={isSubmitting} fullWidth>
          {AUTH_UI.LOGIN.SUBMIT}
        </Button>

        <Divider spacing="sm" />

        <Stack align="center" gap="sm">
          <Text variant={TEXT_VARIANT.MICRO} colorTheme={TEXT_THEME.MUTED}>
            {AUTH_UI.LOGIN.NO_ACCOUNT}
          </Text>

          <Button
            to={ROUTES.NAV.REGISTER}
            variant={BUTTON_VARIANT.GHOST}
            size={BUTTON_SIZE.SMALL}
          >
            {AUTH_UI.LOGIN.REGISTER_LINK}
          </Button>
        </Stack>
      </WizardCard>
    </WizardLayout>
  );
};
