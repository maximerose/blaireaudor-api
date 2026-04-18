import { ROUTES } from '../constants/routes';
import { useRegistration } from '../hooks/useRegistration';
import { HistoricalPlayerSearch } from './Registration/HistoricalPlayerSearch';
import { AuthCard } from './UI/AuthCard';
import { Button } from './UI/Button';
import { Input } from './UI/Input';

const RegistrationForm = () => {
  const {
    formData,
    message,
    usernameAvailable,
    isLoading,
    checkLoading,
    showUsernameHint,
    submitButtonText,
    isSubmitDisabled,
    playerSearch,
    handleDisplayNameChange,
    handleUsernameChange,
    handleUsernameFocus,
    handleUsernameBlur,
    handlePasswordChange,
    handleSubmit,
  } = useRegistration(ROUTES.DASHBOARD);

  return (
    <AuthCard title="S'inscrire" onSubmit={handleSubmit}>
      <HistoricalPlayerSearch
        searchProps={playerSearch}
        selectedName={formData.display_name}
      />
      <Input
        label="Nom d'affichage"
        type="text"
        value={formData.display_name || ''}
        onChange={handleDisplayNameChange}
        disabled={isLoading}
        required
      />

      <Input
        label="Nom d'utilisateur"
        icon="@"
        type="text"
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

      {formData.username.length >= 3 && (
        <div className="text-[11px] text-center font-medium">
          {checkLoading && (
            <span className="text-gold animate-pulse">
              Vérification en cours...
            </span>
          )}
          {!checkLoading && usernameAvailable === true && (
            <span className="text-green-500">✅ Pseudo disponible !</span>
          )}
          {!checkLoading && usernameAvailable === false && (
            <span className="text-red-500">❌ Ce pseudo est déjà pris.</span>
          )}
        </div>
      )}

      <Input
        label="Mot de passe"
        type="password"
        value={formData.plain_password || ''}
        onChange={handlePasswordChange}
        disabled={isLoading}
        required
      />

      <Button type="submit" isLoading={isSubmitDisabled} fullWidth>
        {submitButtonText}
      </Button>

      {message && (
        <p className="mt-2 text-center text-sm text-white font-medium animate-fade-in">
          {message}
        </p>
      )}
    </AuthCard>
  );
};

export default RegistrationForm;
