import {
  AVAILABILITY,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  cn,
  FORM,
  ICONS,
  Input,
  preventDefault,
  ROUTES,
  Text,
  TEXT_VARIANT,
  WizardLayout,
} from '@/shared';
import { AuthCard } from '@/components/UI/AuthCard';
import { useRegistration } from '@/features/account/hooks';
import { AUTH_UI } from '@/features/account/constants';
import { HistoricalPlayerSearch } from './HistoricalPlayerSearch';
import { GuestFoundAlert } from './GuestFoundAlert';
import { PasswordStrength } from './PasswordStrength';

export const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    handleDisplayNameChange,
    handleUsernameChange,
    handleUsernameFocus,
    handleUsernameBlur,
    handleDisplayNameBlur,
    globalMessage,
    isLoading,
    isSubmitting,
    usernameStatus,
    emailStatus,
    usernameCheckLoading,
    emailCheckLoading,
    displayStates,
    submitButtonText,
    isSubmitDisabled,
    playerSearch,
    foundGuest,
    linkFoundGuest,
  } = useRegistration(ROUTES.NAV.DASHBOARD);

  const passwordValue = watch('plain_password') || '';

  return (
    <WizardLayout title={AUTH_UI.REGISTER.TITLE}>
      <AuthCard
        title={AUTH_UI.REGISTER.TITLE}
        onSubmit={preventDefault(handleSubmit)}
      >
        <HistoricalPlayerSearch
          searchProps={playerSearch}
          selectedName={watch('display_name')}
        />

        <div className="space-y-4">
          <Input
            label={FORM.AUTH.LABELS.DISPLAY_NAME}
            type="text"
            autoComplete="name"
            placeholder={FORM.AUTH.PLACEHOLDERS.DISPLAY_NAME}
            disabled={isLoading || isSubmitting}
            required
            error={errors?.display_name?.message}
            {...register('display_name', {
              onChange: handleDisplayNameChange,
              onBlur: handleDisplayNameBlur,
            })}
          />

          <div className="space-y-1">
            <Input
              label={FORM.AUTH.LABELS.EMAIL}
              type="email"
              icon="@"
              autoComplete="email"
              placeholder={FORM.AUTH.PLACEHOLDERS.EMAIL}
              disabled={isLoading || isSubmitting}
              required
              error={errors?.email?.message}
              {...register('email')}
            />

            {displayStates.shouldShowEmailCheck && !errors?.email && (
              <div aria-live="polite">
                {emailCheckLoading ? (
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    className="text-gold animate-pulse text-center"
                  >
                    {FORM.AUTH.HINTS.EMAIL_CHECK}
                  </Text>
                ) : (
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    className={cn(
                      'text-center',
                      emailStatus === AVAILABILITY.AVAILABLE
                        ? 'text-success-bright'
                        : 'text-danger-bright',
                    )}
                  >
                    <span className="mr-2" aria-hidden="true">
                      {emailStatus === AVAILABILITY.AVAILABLE
                        ? ICONS.SUCCESS
                        : ICONS.FAILURE}
                    </span>
                    {emailStatus === AVAILABILITY.AVAILABLE
                      ? FORM.AUTH.HINTS.EMAIL_AVAILABLE
                      : FORM.AUTH.HINTS.EMAIL_TAKEN}
                  </Text>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Input
              label={FORM.AUTH.LABELS.USERNAME}
              icon={ICONS.PLAYER}
              type="text"
              autoComplete="username"
              placeholder={FORM.AUTH.PLACEHOLDERS.USERNAME}
              disabled={isLoading || isSubmitting}
              required
              aria-describedby={
                displayStates.shouldShowUsernameHint
                  ? 'username-hint'
                  : undefined
              }
              error={errors?.username?.message}
              {...register('username', {
                onChange: handleUsernameChange,
                onBlur: handleUsernameBlur,
              })}
              onFocus={handleUsernameFocus}
            />

            {displayStates.shouldShowUsernameHint && !errors.username && (
              <Text
                id="username-hint"
                variant={TEXT_VARIANT.MICRO}
                className="px-1 italic text-gold/60"
              >
                <span aria-hidden="true">{ICONS.HINT} </span>{' '}
                {FORM.AUTH.HINTS.USERNAME_HINT}
              </Text>
            )}

            {displayStates.shouldShowUsernameHint && !errors.username && (
              <div aria-live="polite">
                {usernameCheckLoading ? (
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    className="text-gold animate-pulse text-center"
                  >
                    {FORM.AUTH.HINTS.USERNAME_CHECK}
                  </Text>
                ) : (
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    className={cn(
                      'text-center',
                      usernameStatus === AVAILABILITY.AVAILABLE
                        ? 'text-success-bright'
                        : 'text-danger-bright',
                    )}
                  >
                    <span className="mr-2" aria-hidden="true">
                      {usernameStatus === AVAILABILITY.AVAILABLE
                        ? ICONS.SUCCESS
                        : ICONS.FAILURE}
                    </span>
                    {usernameStatus === AVAILABILITY.AVAILABLE
                      ? FORM.AUTH.HINTS.USERNAME_AVAILABLE
                      : FORM.AUTH.HINTS.USERNAME_TAKEN}
                  </Text>
                )}
              </div>
            )}
          </div>
        </div>

        {displayStates.shouldShowGuestAlert && foundGuest && (
          <GuestFoundAlert
            foundGuest={foundGuest}
            username={watch('username')}
            onLink={linkFoundGuest}
          />
        )}

        <div className="space-y-4">
          <Input
            label={FORM.AUTH.LABELS.PASSWORD}
            type="password"
            icon={ICONS.SECRET}
            autoComplete="new-password"
            placeholder={FORM.AUTH.PLACEHOLDERS.PASSWORD}
            disabled={isLoading || isSubmitting}
            required
            error={errors?.plain_password?.message}
            {...register('plain_password')}
          />

          {passwordValue.length > 0 && !errors.plain_password && (
            <PasswordStrength password={passwordValue} />
          )}

          <Input
            label={FORM.AUTH.LABELS.CONFIRM_PASSWORD}
            type="password"
            icon={ICONS.CHECK}
            autoComplete="new-password"
            placeholder={FORM.AUTH.PLACEHOLDERS.PASSWORD}
            disabled={isLoading || isSubmitting}
            required
            error={errors?.confirm_password?.message}
            {...register('confirm_password')}
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading || isSubmitting}
          disabled={isSubmitDisabled}
          fullWidth
          className="mt-4"
          aria-disabled={isSubmitDisabled}
        >
          {submitButtonText}
        </Button>

        {globalMessage && (
          <Text
            variant={TEXT_VARIANT.BODY}
            className="mt-4 text-center text-danger-bright animate-fade-in"
          >
            {globalMessage}
          </Text>
        )}

        <div className="flex justify-center mt-6 pt-4 border-t border-white/5">
          <Button
            to={ROUTES.NAV.LOGIN}
            variant={BUTTON_VARIANT.GHOST}
            size={BUTTON_SIZE.SMALL}
            className="transition-default"
          >
            {AUTH_UI.REGISTER.ALREADY_ACCOUNT}
          </Button>
        </div>
      </AuthCard>
    </WizardLayout>
  );
};

export default RegistrationForm;
