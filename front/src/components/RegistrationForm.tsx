import { ROUTES } from '../constants/routes';
import { useRegistration } from '../hooks/useRegistration';

const RegistrationForm = () => {
  const {
    formData,
    message,
    isLoading,
    usernameAvailable,
    checkLoading,
    showUsernameHint,
    handleDisplayNameChange,
    handleUsernameChange,
    handleUsernameFocus,
    handleUsernameBlur,
    handlePasswordChange,
    handleSubmit,
  } = useRegistration(ROUTES.DASHBOARD);

  // Avant le return
  let buttonClass =
    'w-full py-3 font-bold rounded-lg transition-all shadow-lg shadow-gold/20 ';
  let buttonText = "S'inscrire au Blaireau d'Or";

  if (isLoading || checkLoading) {
    buttonClass += 'bg-gold/50 cursor-not-allowed opacity-70';
    buttonText = isLoading
      ? 'Inscription en cours...'
      : "Vérification du nom d'utilisateur en cours...";
  } else {
    buttonClass +=
      'bg-gold text-dark hover:bg-gold/90 active:scale-95 cursor-pointer';
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-gold/20 shadow-2xl w-full"
    >
      <h2 className="text-3xl font-bold text-gold mb-6 text-center">
        S'inscrire
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gold/80 text-sm mb-1">
            Nom d'affichage
          </label>
          <input
            type="text"
            value={formData.display_name || ''}
            onChange={handleDisplayNameChange}
            className="w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-center"
            required
          />
        </div>

        <div>
          <label className="block text-gold/80 text-sm mb-1">
            Nom d'utilisateur
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gold/50 pointer-events-none">
              @
            </span>
            <input
              type="text"
              value={formData.username || ''}
              onChange={handleUsernameChange}
              onFocus={handleUsernameFocus}
              onBlur={handleUsernameBlur}
              placeholder="votre-pseudo"
              className="w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-center"
              required
              aria-label="Nom d'utilisateur"
            />
          </div>
          {showUsernameHint && (
            <p className="text-[10px] text-gold/60 mt-1">
              💡 Minuscules, chiffres et tirets uniquement. Les espaces et
              caractères spéciaux sont convertis automatiquement.
            </p>
          )}
          {formData.username.length >= 3 && (
            <div className="text-xs mt-1 text-center">
              {checkLoading && (
                <span className="text-gold animate-pulse">Vérification...</span>
              )}
              {usernameAvailable === true && (
                <span className="text-green-500">✅ Pseudo libre !</span>
              )}
              {usernameAvailable === false && (
                <span className="text-red-500">❌ Déjà pris !</span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gold/80 text-sm mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            value={formData.plain_password || ''}
            onChange={handlePasswordChange}
            className="w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-center"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || checkLoading}
          className={buttonClass}
        >
          {buttonText}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center text-sm text-white font-medium">
          {message}
        </p>
      )}
    </form>
  );
};

export default RegistrationForm;
