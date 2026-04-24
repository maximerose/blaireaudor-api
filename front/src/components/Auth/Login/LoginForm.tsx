import { useLogin } from '@/hooks';
import { ROUTES } from '@/constants/routes';
import { Input, Button, AuthCard, Text } from '@/components/UI';
import { preventDefault } from '@/utils';

const LoginForm = () => {
  const { credentials, error, isLoading, handleChange, handleSubmit } =
    useLogin();

  return (
    <AuthCard title="Le Blaireau d'Or" onSubmit={preventDefault(handleSubmit)}>
      <Text variant="caption" className="text-gold/50 mb-6 block text-center">
        Identifiez-vous pour entrer dans l'arène
      </Text>

      {error && (
        <div
          className="bg-danger/10 border border-danger-bright/20 p-3 rounded-xl animate-pulse motion-reduce:animate-none"
          role="alert"
        >
          <Text
            variant="micro"
            className="text-danger-bright text-center opacity-100"
          >
            <span aria-hidden="true">⚠️ </span>
            {error}
          </Text>
        </div>
      )}

      <div className="space-y-4">
        <Input
          name="username"
          label="Nom d'utilisateur"
          icon="@"
          placeholder="Ton pseudo..."
          autoComplete="username"
          value={credentials.username}
          onChange={handleChange}
          disabled={isLoading}
          required
          align="center"
        />

        <Input
          name="password"
          label="Mot de passe"
          type="password"
          icon="🔑"
          placeholder="••••••••"
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
          aria-label="Créer un nouveau compte"
        >
          S'inscrire ici
        </Button>
      </div>
    </AuthCard>
  );
};

export default LoginForm;
