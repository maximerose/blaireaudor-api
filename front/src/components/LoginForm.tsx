import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '../constants/routes';
import { Input } from './UI/Input';
import { Button } from './UI/Button';
import { AuthCard } from './UI/AuthCard';
import { Text } from './UI/Typography';

const LoginForm = () => {
  const { credentials, error, isLoading, handleChange, handleSubmit } =
    useLogin();

  return (
    <AuthCard title="Le Blaireau d'Or" onSubmit={handleSubmit}>
      <Text variant="caption" className="text-gold/50 mb-6 block text-center">
        Identifiez-vous pour entrer dans l'arène
      </Text>

      {error && (
        <div className="bg-danger/10 border border-danger-bright/20 p-3 rounded-xl animate-pulse">
          <Text
            variant="micro"
            className="text-danger-bright text-center opacity-100"
          >
            ⚠️ {error}
          </Text>
        </div>
      )}

      <div className="space-y-4">
        <Input
          name="username"
          icon="@"
          placeholder="Nom d'utilisateur"
          autoComplete="username"
          value={credentials.username}
          onChange={handleChange}
          disabled={isLoading}
          required
          align="center"
        />

        <Input
          name="password"
          type="password"
          icon="🔑"
          placeholder="Mot de passe"
          autoComplete="current-password"
          value={credentials.password}
          onChange={handleChange}
          disabled={isLoading}
          required
          align="center"
        />
      </div>

      <Button type="submit" isLoading={isLoading} fullWidth className="mt-4">
        Se connecter
      </Button>

      <div className="text-center pt-4 border-t border-white/5 mt-4">
        <Text variant="micro" className="block mb-2">
          Pas encore de compte ?
        </Text>
        <Button
          to={ROUTES.NAV_REGISTER}
          variant="ghost"
          size="sm"
          className="text-gold"
        >
          S'inscrire ici
        </Button>
      </div>
    </AuthCard>
  );
};

export default LoginForm;
