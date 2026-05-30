import { AUTH_UI } from '@/features/account/constants';
import { useLogin } from '@/features/account/hooks';
import { useJoinCodeQuery } from '@/features/competition/join';
import {
  Alert,
  BadgerLogo,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  CARD_VARIANT,
  Divider,
  ERRORS,
  FORM,
  Input,
  ROUTES,
  Row,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
  UI,
  WizardCard,
  WizardLayout,
} from '@/shared';
import { Link, useSearchParams } from 'react-router-dom';
import { PasswordField } from './fields/PasswordField';

export const LoginForm = () => {
  const [searchParams] = useSearchParams();
  const joinCode = searchParams.get('code')?.toUpperCase() || null;
  const registerUrl = joinCode
    ? ROUTES.NAV.REGISTER_WITH_JOIN_CODE(joinCode)
    : ROUTES.NAV.REGISTER;
  const { data: compData, isLoading: isCompLoading } =
    useJoinCodeQuery(joinCode);
  const isFinished = compData?.competition?.is_finished;

  const { register, handleSubmit, handleUsernameChange, isSubmitting, errors } =
    useLogin();

  return (
    <WizardLayout title={AUTH_UI.LOGIN.TITLE}>
      <Stack as="h1" gap="md" align="center" mb="lg">
        <BadgerLogo className="w-30 h-30 md:w-40 md:h-40 drop-shadow-[0_0_15px_rgba(255,184,0,0.3)]" />
        <Text as="h1" variant={TEXT_VARIANT.H1} colorTheme={TEXT_THEME.GOLD}>
          {UI.APP_NAME}
        </Text>
      </Stack>
      <WizardCard
        as="form"
        variant={CARD_VARIANT.GLASS}
        title={AUTH_UI.LOGIN.TITLE}
        onSubmit={handleSubmit}
        noValidate
      >
        {errors.root?.serverError?.message && (
          <Alert variant="danger">{errors.root.serverError.message}</Alert>
        )}

        {joinCode && !isFinished && (
          <Alert variant="info" className="mb-4">
            {AUTH_UI.LOGIN.QR_JOIN_LOGIN(
              <span className="font-mono font-black text-gold tracking-widest px-1">
                {isCompLoading
                  ? UI.LOADING_DEFAULT
                  : compData?.competition?.name || joinCode}
              </span>,
            )}
          </Alert>
        )}

        {joinCode && isFinished && (
          <Alert variant="danger" className="mb-4">
            {ERRORS.COMPETITION.COMPETITION_FINISHED}
          </Alert>
        )}

        <Input
          label={FORM.AUTH.LABELS.IDENTIFIER}
          icon="@"
          placeholder={FORM.AUTH.PLACEHOLDERS.IDENTIFIER}
          autoComplete="username"
          disabled={isSubmitting}
          required
          hideAsterisk
          align="center"
          {...register('username', { onChange: handleUsernameChange })}
        />

        <Stack gap="xs">
          <PasswordField
            label={FORM.AUTH.LABELS.PASSWORD}
            autoComplete="current-password"
            disabled={isSubmitting}
            required
            hideAsterisk
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
            to={registerUrl}
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
