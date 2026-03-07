import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/userLogin';
import { ROUTES } from '../constants/routes';
import { Input } from './UI/Input';
import { Button } from './UI/Button';
import { AuthCard } from './UI/AuthCard';

const LoginForm = () => {
  const { credentials, error, isLoading, handleChange, handleSubmit } =
    useLogin();

  return (
    <AuthCard title="Le Blaireau d'Or" onSubmit={handleSubmit}>
      <p className="text-sm text-gold/60">
        Identifiez-vous pour entrer dans l'arène
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] p-3 rounded text-center uppercase tracking-tighter">
          {error}
        </div>
      )}

      <Input
        name="username"
        icon="@"
        placeholder="Nom d'utilisateur"
        value={credentials.username}
        onChange={handleChange}
        required
      />

      <Input
        name="password"
        type="password"
        placeholder="Mot de passe"
        value={credentials.password}
        onChange={handleChange}
        required
      />

      <Button isLoading={isLoading}>
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>

      <div className="text-center mt-4">
        <Link
          to={ROUTES.REGISTER}
          className="text-[10px] text-gold/30 hover:text-gold uppercase tracking-widest transition-colors"
        >
          Pas encore de compte ? S'incrire ici
        </Link>
      </div>
    </AuthCard>
  );
};

export default LoginForm;
