import { AUTH_UI } from '@/features/account/constants';
import { useRegistration } from '@/features/account/hooks';
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
  preventDefault,
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
import { useSearchParams } from 'react-router-dom';
import { GuestFoundAlert } from './GuestFoundAlert';
import { HistoricalPlayerSearch } from './HistoricalPlayerSearch';
import { ConfirmPasswordField } from './fields/ConfirmPasswordField';
import { DisplayNameField } from './fields/DisplayNameField';
import { EmailField } from './fields/EmailField';
import { PasswordField } from './fields/PasswordField';
import { UsernameField } from './fields/UsernameField';

export const RegistrationForm = () => {
  const [searchParams] = useSearchParams();
  const joinCode = searchParams.get('code')?.toUpperCase() || null;
  const { data: compData, isLoading: isCompLoading } =
    useJoinCodeQuery(joinCode);
  const isFinished = compData?.competition?.is_finished;

  const {
    register,
    handleSubmit,
    errors,
    watch,
    handleDisplayNameChange,
    handleDisplayNameBlur,
    isLoading,
    isSubmitting,
    displayStates,
    isSubmitDisabled,
    playerSearch,
    foundGuest,
    linkFoundGuest,
    usernameRegistryOptions,
  } = useRegistration(ROUTES.NAV.DASHBOARD);

  const passwordValue = watch('plain_password') || '';
  const isInputDisabled = isLoading || isSubmitting || playerSearch.searching;

  const loginUrl = joinCode
    ? ROUTES.NAV.LOGIN_WITH_JOIN_CODE(joinCode)
    : ROUTES.NAV.LOGIN;

  return (
    <WizardLayout title={AUTH_UI.REGISTER.TITLE}>
      <Stack gap="md" align="center" mb="lg">
        <BadgerLogo className="w-20 h-20 md:w-30 md:h-30 drop-shadow-[0_0_15px_rgba(255,184,0,0.3)]" />
        <Text variant={TEXT_VARIANT.H1} colorTheme={TEXT_THEME.GOLD}>
          {UI.APP_NAME}
        </Text>
      </Stack>
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
              registerOptions={usernameRegistryOptions}
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
