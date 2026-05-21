import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
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
import { DisplayNameField } from './fields/DisplayNameField';
import { EmailField } from './fields/EmailField';
import { UsernameField } from './fields/UsernameField';
import { PasswordField } from './fields/PasswordField';
import { ConfirmPasswordField } from './fields/ConfirmPasswordField';

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
    handleEmailBlur,
    globalMessage,
    isLoading,
    isSubmitting,
    usernameStatus,
    emailStatus,
    usernameLoading,
    emailLoading,
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
          <DisplayNameField
            disabled={isLoading || isSubmitting}
            error={errors?.display_name?.message}
            {...register('display_name', {
              onChange: handleDisplayNameChange,
              onBlur: handleDisplayNameBlur,
            })}
          />

          <EmailField
            emailStatus={emailStatus}
            emailLoading={emailLoading}
            disabled={isLoading || isSubmitting}
            error={errors?.email?.message}
            {...register('email', { onBlur: handleEmailBlur })}
          />

          <UsernameField
            usernameStatus={usernameStatus}
            usernameLoading={usernameLoading}
            showHint={displayStates.shouldShowUsernameHint}
            disabled={isLoading || isSubmitting}
            error={errors?.username?.message}
            {...register('username', {
              onChange: handleUsernameChange,
              onBlur: handleUsernameBlur,
            })}
            onFocus={handleUsernameFocus}
          />
        </div>

        {displayStates.shouldShowGuestAlert && foundGuest && (
          <GuestFoundAlert
            foundGuest={foundGuest}
            username={watch('username')}
            onLink={linkFoundGuest}
          />
        )}

        <div className="space-y-4">
          <PasswordField
            autoComplete="new-password"
            disabled={isLoading || isSubmitting}
            watchValue={passwordValue}
            error={errors?.plain_password?.message}
            {...register('plain_password')}
          />

          <ConfirmPasswordField
            autoComplete="new-password"
            disabled={isLoading || isSubmitting}
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
