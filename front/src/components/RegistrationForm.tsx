import { useRegistration } from '../hooks/useRegistration';
import { ROUTES } from '../constants/routes';
import { HistoricalPlayerSearch } from './Registration/HistoricalPlayerSearch';
import { AuthCard } from './UI/AuthCard';
import { Button } from './UI/Button';
import { Input } from './UI/Input';
import { Badge } from './UI/Badge';
import { Text } from './UI/Typography';
import { cn } from '../utils/cn';

const RegistrationForm = () => {
  const {
    formData,
    message,
    usernameStatus,
    isLoading,
    checkLoading,
    showUsernameHint,
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
      <HistoricalPlayerSearch
        searchProps={playerSearch}
        selectedName={formData.display_name}
      />

      <div className="space-y-4">
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
            aria-describedby={showUsernameHint ? 'username-hint' : undefined}
          />

          {showUsernameHint && (
            <Text
              id="username-hint"
              variant="micro"
              className="px-1 italic text-gold/60"
            >
              <span aria-hidden="true">💡 </span>
              Minuscules, chiffres et tirets uniquement.
            </Text>
          )}
        </div>
      </div>

      {formData.username.length >= 3 && usernameStatus !== 'guest_exists' && (
        <div className="py-1" aria-live="polite">
          {checkLoading ? (
            <Text
              variant="micro"
              className="text-gold animate-pulse text-center motion-reduce:animate-none"
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

      {!checkLoading && usernameStatus === 'guest_exists' && foundGuest && (
        <div
          className="flex flex-col items-center gap-2 mt-3 p-4 bg-info/10 border border-info-bright/20 rounded-2xl animate-slide-up"
          role="alert"
        >
          <Text
            variant="micro"
            className="text-info-bright text-center opacity-100"
          >
            <span aria-hidden="true">👀 </span>
            Un blaireau existe déjà
          </Text>

          <Text
            variant="body"
            className="text-white/70 text-[11px] text-center leading-tight"
          >
            Le pseudo{' '}
            <Text variant="mono" as="span" className="text-white text-[11px]">
              @{formData.username}
            </Text>{' '}
            appartient à{' '}
            <span className="text-white font-bold">{foundGuest.name}</span>.
          </Text>

          {foundGuest.last_competition_name ? (
            <div className="flex items-center gap-1 mt-1 overflow-hidden">
              <Text
                variant="micro"
                className="italic shrink-0 opacity-20 font-bold"
              >
                Dernier tournoi :
              </Text>
              <Text
                variant="micro"
                className="text-info-bright/60 italic truncate opacity-100"
              >
                {foundGuest.last_competition_name}
              </Text>
            </div>
          ) : (
            <Badge variant="info" className="mt-1 opacity-60">
              Nouveau joueur <span aria-hidden="true">🐣</span>
            </Badge>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="mt-2 w-full border-info-bright/30 hover:bg-info/20 text-info-bright"
            onClick={linkFoundGuest}
            type="button"
            aria-label={`Lier le profil existant de ${foundGuest.name} à mon compte`}
          >
            C'est moi, lier ce profil
          </Button>
        </div>
      )}

      <Input
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
        value={formData.plain_password || ''}
        onChange={handlePasswordChange}
        disabled={isLoading}
        placeholder="••••••••"
        required
      />

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isSubmitDisabled}
        fullWidth
        className="mt-2"
        aria-disabled={isSubmitDisabled}
      >
        {submitButtonText}
      </Button>

      {message && (
        <div role="status" aria-live="polite">
          <Text
            variant="body"
            className="mt-2 text-center text-white font-medium animate-fade-in"
          >
            {message}
          </Text>
        </div>
      )}

      <div className="flex justify-center mt-4 pt-4 border-t border-white/5">
        <Button
          to={ROUTES.NAV_LOGIN}
          variant="ghost"
          size="sm"
          aria-label="Aller à la page de connexion"
        >
          Déjà inscrit ?
        </Button>
      </div>
    </AuthCard>
  );
};

export default RegistrationForm;
