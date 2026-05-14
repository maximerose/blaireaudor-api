import { useRegistration } from '@/hooks';
import { ROUTES, FORM, ICONS, AUTH_UI } from '@/constants';
import { HistoricalPlayerSearch, GuestFoundAlert } from '@/components/Auth';
import {
  AuthCard,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Input,
  Text,
  TEXT_VARIANT,
} from '@/components/UI';
import { cn, preventDefault } from '@/utils';

export const RegistrationForm = () => {
  const {
    formData,
    message,
    usernameStatus,
    isLoading,
    checkLoading,
    displayStates,
    submitButtonText,
    isSubmitDisabled,
    playerSearch,
    foundGuest,
    handleDisplayNameChange,
    handleUsernameChange,
    handleUsernameFocus,
    handleUsernameBlur,
    handleDisplayNameBlur,
    handlePasswordChange,
    handleSubmit,
    linkFoundGuest,
  } = useRegistration(ROUTES.NAV.DASHBOARD);

  return (
    <AuthCard title="S'inscrire" onSubmit={preventDefault(handleSubmit)}>
      {/* 1. Recherche historique (liaison de compte existant) */}
      <HistoricalPlayerSearch
        searchProps={playerSearch}
        selectedName={formData.display_name}
      />

      <div className="space-y-4">
        {/* 2. Nom d'affichage */}
        <Input
          label={FORM.AUTH.LABELS.DISPLAY_NAME}
          type="text"
          autoComplete="name"
          value={formData.display_name || ''}
          onChange={handleDisplayNameChange}
          onBlur={handleDisplayNameBlur}
          disabled={isLoading}
          placeholder={FORM.AUTH.PLACEHOLDERS.DISPLAY_NAME}
          required
        />

        {/* 3. Nom d'utilisateur & Aide au formatage */}
        <div className="space-y-1">
          <Input
            label={FORM.AUTH.LABELS.USERNAME}
            icon="@"
            type="text"
            autoComplete="username"
            value={formData.username || ''}
            onChange={handleUsernameChange}
            onFocus={handleUsernameFocus}
            onBlur={handleUsernameBlur}
            placeholder={FORM.AUTH.PLACEHOLDERS.USERNAME}
            disabled={isLoading}
            required
            aria-describedby={
              displayStates.shouldShowUsernameHint ? 'username-hint' : undefined
            }
          />

          {displayStates.shouldShowUsernameHint && (
            <Text
              id="username-hint"
              variant={TEXT_VARIANT.MICRO}
              className="px-1 italic text-gold/60"
            >
              <span aria-hidden="true">{ICONS.HINT} </span>{' '}
              {FORM.AUTH.HINTS.USERNAME_HINT}
            </Text>
          )}
        </div>
      </div>

      {/* 4. Feedback de disponibilité du pseudo */}
      {displayStates.shouldShowUsernameCheck && (
        <div className="py-1" aria-live="polite">
          {checkLoading ? (
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
                usernameStatus === 'available'
                  ? 'text-success-bright'
                  : 'text-danger-bright',
              )}
            >
              <span className="mr-2" aria-hidden="true">
                {usernameStatus === 'available'
                  ? `${ICONS.SUCCESS} `
                  : `${ICONS.FAILURE} `}
              </span>
              {usernameStatus === 'available'
                ? FORM.AUTH.HINTS.USERNAME_AVAILABLE
                : FORM.AUTH.HINTS.USERNAME_TAKEN}
            </Text>
          )}
        </div>
      )}

      {/* 5. Alerte si un profil invité correspondant est trouvé */}
      {displayStates.shouldShowGuestAlert && foundGuest && (
        <GuestFoundAlert
          foundGuest={foundGuest}
          username={formData.username}
          onLink={linkFoundGuest}
        />
      )}

      {/* 6. Mot de passe */}
      <Input
        label={FORM.AUTH.LABELS.PASSWORD}
        type="password"
        autoComplete="new-password"
        value={formData.plain_password || ''}
        onChange={handlePasswordChange}
        disabled={isLoading}
        placeholder={FORM.AUTH.PLACEHOLDERS.PASSWORD}
        required
      />

      {/* 7. Bouton d'action principal */}
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isSubmitDisabled}
        fullWidth
        className="mt-4 transition-default"
        aria-disabled={isSubmitDisabled}
      >
        {submitButtonText}
      </Button>

      {/* 8. Messages d'erreur du serveur */}
      {message && (
        <div role="status" aria-live="polite">
          <Text
            variant={TEXT_VARIANT.BODY}
            className="mt-4 text-center text-white font-medium animate-fade-in"
          >
            {message}
          </Text>
        </div>
      )}

      {/* 9. Lien vers la connexion */}
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
  );
};

export default RegistrationForm;
