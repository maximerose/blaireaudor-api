import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/userLogin';
import { ROUTES } from '../constants/routes';

const LoginForm = () => {
  const { credentials, error, isLoading, handleChange, handleSubmit } =
    useLogin();

  let buttonClass =
    'w-full py-3 font-bold rounded-lg transition-all shadow-lg shadow-gold/20 ';
  let buttonText = 'Se connecter';

  if (isLoading) {
    buttonClass += 'bg-gold/50 cursor-not-allowed opacity-70';
    buttonText = 'Connexion en cours...';
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
        Le Blaireau d'Or
      </h2>

      <div className="space-y-4">
        <p className="text-sm text-gold/60">
          Identifiez-vous pour entrer dans l'arène
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] p-3 rounded text-center uppercase tracking-tighter">
            {error}
          </div>
        )}

        <div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gold/40 pointer-events-none text-sm">
              @
            </span>
            <input
              name="username"
              type="text"
              required
              className="w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-center"
              placeholder="Nom d'utilisateur"
              aria-label="Nom d'utilisateur"
              value={credentials.username}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <input
            name="password"
            type="password"
            required
            className="w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-center"
            placeholder="Mot de passe"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={isLoading} className={buttonClass}>
          {buttonText}
        </button>

        <div className="text-center mt-4">
          <Link
            to={ROUTES.REGISTER}
            className="text-[10px] text-gold/30 hover:text-gold uppercase tracking-widest transition-colors"
          >
            Pas encore de compte ? S'inscrire ici
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
