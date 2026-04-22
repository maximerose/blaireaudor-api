import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useRegistration } from '../hooks/useRegistration';
import { HistoricalPlayerSearch } from './Registration/HistoricalPlayerSearch';
import { AuthCard } from './UI/AuthCard';
import { Button } from './UI/Button';
import { Input } from './UI/Input';
import { Badge } from './UI/Badge';

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
      <Input
        label="Nom d'affichage"
        type="text"
        autoComplete="name"
        value={formData.display_name || ''}
        onChange={handleDisplayNameChange}
        onBlur={handleDisplayNameBlur}
        disabled={isLoading}
        required
      />

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
      />

      {showUsernameHint && (
        <p className="text-[10px] text-gold/60 px-1 italic">
          💡 Minuscules, chiffres et tirets uniquement.
        </p>
      )}

      {formData.username.length >= 3 && usernameStatus !== 'guest_exists' && (
        <div className="text-[11px] text-center font-medium">
          {checkLoading && (
            <span className="text-gold animate-pulse">
              Vérification en cours...
            </span>
          )}
          {!checkLoading && usernameStatus === 'available' && (
            <span className="text-green-500">✅ Pseudo disponible !</span>
          )}
          {!checkLoading && usernameStatus === 'taken' && (
            <span className="text-red-500">❌ Ce pseudo est déjà pris.</span>
          )}
        </div>
      )}

      {!checkLoading && usernameStatus === 'guest_exists' && foundGuest && (
        <div className="flex flex-col items-center gap-2 mt-3 p-4 bg-info/10 border border-info-bright/20 rounded-2xl animate-slide-up">
          <span className="text-info-bright text-[10px] uppercase font-black tracking-widest text-center">
            👀 Un blaireau existe déjà
          </span>
          <span className="text-white/70 text-xs text-center leading-tight">
            Le pseudo{' '}
            <span className="font-mono text-white">@{formData.username}</span>{' '}
            appartient à{' '}
            <span className="text-white font-bold">{foundGuest.name}</span>.
          </span>
          {foundGuest.last_competition_name ? (
            <div className="flex items-center gap-1 mt-1 overflow-hidden">
              <span className="text-[9px] text-white/20 italic font-light shrink-0">
                Dernier tournoi :
              </span>
              <span className="text-[9px] text-info-bright/60 italic font-medium truncate">
                {foundGuest.last_competition_name}
              </span>
            </div>
          ) : (
            <Badge
              variant="info"
              className="text-[7px] py-0 px-1.5 mt-1 w-fit opacity-60"
            >
              Nouveau joueur 🐣
            </Badge>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="mt-2 w-full border-info-bright/30 hover:bg-info/20 text-info-bright"
            onClick={linkFoundGuest}
            type="button"
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
        required
      />

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isSubmitDisabled}
        fullWidth
      >
        {submitButtonText}
      </Button>

      {message && (
        <p className="mt-2 text-center text-sm text-white font-medium animate-fade-in">
          {message}
        </p>
      )}
      <div className="flex justify-center mt-4">
        <Link
          to={ROUTES.NAV_LOGIN}
          className="text-[9px] font-black uppercase text-gold/40 hover:text-gold transition-colors tracking-[0.2em]"
        >
          Déjà inscrit ?
        </Link>
      </div>
    </AuthCard>
  );
};

export default RegistrationForm;
