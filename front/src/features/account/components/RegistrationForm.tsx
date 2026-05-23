import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  CARD_VARIANT,
  preventDefault,
  ROUTES,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  WizardCard,
  WizardLayout,
  Stack,
  Row,
  Divider,
  Alert,
} from '@/shared';
import { useRegistration } from '@/features/account/hooks';
import { AUTH_UI } from '@/features/account/constants';
import { HistoricalPlayerSearch } from './HistoricalPlayerSearch';
import { GuestFoundAlert } from './GuestFoundAlert';
import { DisplayNameField } from './fields/DisplayNameField';
import { EmailField } from './fields/EmailField';
import { UsernameField } from './fields/UsernameField';
import { PasswordField } from './fields/PasswordField';
import { ConfirmPasswordField } from './fields/ConfirmPasswordField';
import { useSearchParams } from 'react-router-dom';

export const RegistrationForm = () => {
  const [searchParams] = useSearchParams();
  const joinCode = searchParams.get('code');

  const {
    register,
    handleSubmit,
    errors,
    watch,
    handleDisplayNameChange,
    handleDisplayNameBlur,
    globalMessage,
    isLoading,
    isSubmitting,
    displayStates,
    isSubmitDisabled,
    playerSearch,
    foundGuest,
    linkFoundGuest,
  } = useRegistration(ROUTES.NAV.DASHBOARD);

  const passwordValue = watch('plain_password') || '';
  const isInputDisabled = isLoading || isSubmitting;

  const loginUrl = joinCode
    ? ROUTES.NAV.LOGIN_WITH_JOIN_CODE(joinCode)
    : ROUTES.NAV.LOGIN;

  return (
    <WizardLayout title={AUTH_UI.REGISTER.TITLE}>
      <WizardCard
        as="form"
        variant={CARD_VARIANT.GLASS}
        title={AUTH_UI.REGISTER.TITLE}
        onSubmit={preventDefault(handleSubmit)}
        noValidate
      >
        {joinCode && (
          <Alert variant="info" className="mb-4">
            {AUTH_UI.REGISTER.QR_JOIN_REGISTER(
              <span className="font-mono font-black text-gold tracking-widest px-1">
                {joinCode}
              </span>,
            )}
          </Alert>
        )}
        <HistoricalPlayerSearch
          searchProps={playerSearch}
          selectedName={watch('display_name')}
        />

        <Stack gap="md" className="w-full">
          <DisplayNameField
            disabled={isInputDisabled}
            error={errors?.display_name?.message}
            {...register('display_name', {
              onChange: handleDisplayNameChange,
              onBlur: handleDisplayNameBlur,
            })}
          />

          <EmailField
            register={register}
            watch={watch}
            errors={errors}
            disabled={isInputDisabled}
          />

          <Stack gap="xs" className="w-full">
            <UsernameField
              register={register}
              watch={watch}
              errors={errors}
              currentPlayerId={watch('player_id')}
              showHint={displayStates.shouldShowUsernameHint}
              disabled={isInputDisabled}
            />

            {displayStates.shouldShowGuestAlert && foundGuest && (
              <GuestFoundAlert
                foundGuest={foundGuest}
                username={watch('username')}
                onLink={linkFoundGuest}
              />
            )}
          </Stack>

          <PasswordField
            autoComplete="new-password"
            disabled={isInputDisabled}
            watchValue={passwordValue}
            error={errors?.plain_password?.message}
            {...register('plain_password')}
          />

          <ConfirmPasswordField
            autoComplete="new-password"
            disabled={isInputDisabled}
            error={errors?.confirm_password?.message}
            {...register('confirm_password')}
          />
        </Stack>

        <Stack gap="sm" className="w-full">
          <Button
            type="submit"
            isLoading={isInputDisabled}
            disabled={isSubmitDisabled}
            fullWidth
            className="cursor-pointer"
          >
            {AUTH_UI.REGISTER.SUBMIT}
          </Button>

          {globalMessage && (
            <Text
              variant={TEXT_VARIANT.BODY}
              colorTheme={TEXT_THEME.DANGER}
              className="text-center animate-fade-in"
            >
              {globalMessage}
            </Text>
          )}
        </Stack>

        <Divider spacing="sm" />

        <Row justify="center" className="w-full">
          <Button
            to={loginUrl}
            variant={BUTTON_VARIANT.GHOST}
            size={BUTTON_SIZE.SMALL}
            className="cursor-pointer"
          >
            {AUTH_UI.REGISTER.ALREADY_ACCOUNT}
          </Button>
        </Row>
      </WizardCard>
    </WizardLayout>
  );
};
