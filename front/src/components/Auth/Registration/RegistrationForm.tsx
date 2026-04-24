import { useRegistration } from '@/hooks';
import { ROUTES } from '@/constants/routes';
import { HistoricalPlayerSearch, GuestFoundAlert } from '@/components/Auth';
import { AuthCard, Button, Input, Text } from '@/components/UI';
import { cn } from '@/utils';

const RegistrationForm = () => {
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
  } = useRegistration(ROUTES.NAV_DASHBOARD);

  return (
    <AuthCard title="S'inscrire" onSubmit={handleSubmit}>
      {/* 1. Recherche historique (liaison de compte existant) */}
      <HistoricalPlayerSearch
        searchProps={playerSearch}
        selectedName={formData.display_name}
      />

      <div className="space-y-4">
        {/* 2. Nom d'affichage */}
        <Input
          label="Nom d'affichage"
          type="text"
          autoComplete="name"
          value={formData.display_name || ''}
          onChange={handleDisplayNameChange}
          onBlur={handleDisplayNameBlur}
          disabled={isLoading}
          placeholder="Ex: Jean Dupont"
          required
        />

        {/* 3. Nom d'utilisateur & Aide au formatage */}
        <div className="space-y-1">
          <Input
            label="Nom d'utilisateur"
            icon="@"
            type="text"
            autoComplete="username"
            value={formData.username || ''}
            onChange={handleUsernameChange}
            onFocus={handleUsernameFocus}
            onBlur={handleUsernameBlur}
            placeholder="votre-pseudo"
            disabled={isLoading}
            required
            aria-describedby={
              displayStates.shouldShowUsernameHint ? 'username-hint' : undefined
            }
          />

          {displayStates.shouldShowUsernameHint && (
            <Text
              id="username-hint"
              variant="micro"
              className="px-1 italic text-gold/60"
            >
              <span aria-hidden="true">💡 </span> Minuscules, chiffres et tirets
              uniquement.
            </Text>
          )}
        </div>
      </div>

      {/* 4. Feedback de disponibilité du pseudo */}
      {displayStates.shouldShowUsernameCheck && (
        <div className="py-1" aria-live="polite">
          {checkLoading ? (
            <Text
              variant="micro"
              className="text-gold animate-pulse text-center"
            >
              Vérification en cours...
            </Text>
          ) : (
            <Text
              variant="micro"
              className={cn(
                'text-center',
                usernameStatus === 'available'
                  ? 'text-success-bright'
                  : 'text-danger-bright',
              )}
            >
              <span aria-hidden="true">
                {usernameStatus === 'available' ? '✅ ' : '❌ '}
              </span>
              {usernameStatus === 'available'
                ? 'Pseudo disponible !'
                : 'Ce pseudo est déjà pris.'}
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
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
        value={formData.plain_password || ''}
        onChange={handlePasswordChange}
        disabled={isLoading}
        placeholder="••••••••"
        required
        className="mt-4"
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
            variant="body"
            className="mt-4 text-center text-white font-medium animate-fade-in"
          >
            {message}
          </Text>
        </div>
      )}

      {/* 9. Lien vers la connexion */}
      <div className="flex justify-center mt-6 pt-4 border-t border-white/5">
        <Button
          to={ROUTES.NAV_LOGIN}
          variant="ghost"
          size="sm"
          className="transition-default"
        >
          Déjà inscrit ?
        </Button>
      </div>
    </AuthCard>
  );
};

export default RegistrationForm;
