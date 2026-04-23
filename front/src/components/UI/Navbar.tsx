import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';
import { Text } from './Typography';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav
      className="w-full flex items-center justify-between py-6 border-b border-gold/10 animate-fade-in"
      aria-label="Navigation principale"
    >
      <Link
        to={ROUTES.NAV_DASHBOARD}
        className="flex flex-col group transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none rounded-lg p-1"
        aria-label="Retour au tableau de bord Le Blaireau d'Or"
      >
        <Text
          variant="h1"
          as="span"
          className="text-xl sm:text-2xl leading-none group-hover:text-gold-light transition-colors"
          aria-hidden="true"
        >
          Le BLAIREAU D'OR
        </Text>
        <Text variant="micro" className="mt-1" aria-hidden="true">
          Espace joueur
        </Text>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <div
          className="text-right flex flex-col justify-center"
          role="status"
          aria-label={`Connecté en tant que ${user?.player?.display_name || user?.username}`}
        >
          <Text
            variant="h3"
            as="span"
            className="text-xs sm:text-sm italic tracking-tighter group-hover:text-gold-light transition-colors"
          >
            <span className="sr-only">Session de : </span>
            {user?.player?.display_name || user?.username}
          </Text>
          <div
            className="h-px w-full bg-gold/10 self-end mt-0.5"
            aria-hidden="true"
          />
        </div>

        <Button
          to={ROUTES.NAV_LOGOUT}
          variant="danger"
          size="sm"
          className="px-4"
          aria-label="Se déconnecter de l'application"
        >
          Quitter
        </Button>
      </div>
    </nav>
  );
};
