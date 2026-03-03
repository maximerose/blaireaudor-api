import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/userLogin';
import { ROUTES } from '../constants/routes';

const LoginForm = () => {
  const { credentials, error, isLoading, handleChange, handleSubmit } =
    useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4 font-sans">
      <div className="max-w-md w-full space-y-8 p-10 bg-dark-lighter rounded-xl border border-gold/10 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gold uppercase tracking-widest italic">
            Le Blaireau d'Or
          </h2>
          <p className="mt-2 text-sm text-gold/60">
            Identifiez-vous pour entrer dans l'arène
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] p-3 rounded text-center uppercase tracking-tighter">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gold/40 pointer-events-none text-sm">
                @
              </span>
              <input
                name="username"
                type="text"
                required
                className="w-full bg-dark/50 border border-gold/20 text-gold rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-gold transition-all placeholder-gold/10"
                placeholder="pseudo"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>

            <input
              name="password"
              type="password"
              required
              className="w-full bg-dark/50 border border-gold/20 text-gold rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-all placeholder-gold/10"
              placeholder="mot de passe"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-dark bg-gold hover:bg-gold-light focus:outline-none transition-all tracking-widest ${
              isLoading
                ? 'opacity-50 cursor-wait'
                : 'cursor-pointer active:scale-95'
            }`}
          >
            {isLoading ? 'VÉRIFICATION...' : 'SE CONNECTER'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to={ROUTES.REGISTER}
            className="text-[10px] text-gold/30 hover:text-gold uppercase tracking-widest transition-colors"
          >
            Pas encore de compte ? S'inscrire ici
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
