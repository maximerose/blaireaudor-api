import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';
import { Text } from './Typography';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between py-6 border-b border-gold/10 animate-fade-in">
      <Link
        to={ROUTES.NAV_DASHBOARD}
        className="flex flex-col group transition-transform active:scale-95"
      >
        <Text
          variant="h1"
          as="span"
          className="text-xl sm:text-2xl leading-none group-hover:text-gold-light transition-colors"
        >
          Le BLAIREAU D'OR
        </Text>
        <Text variant="micro" className="mt-1">
          Espace joueur
        </Text>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="text-right flex flex-col justify-center">
          <Text
            variant="h3"
            as="span"
            className="text-xs sm:text-sm italic tracking-tighter group-hover:text-gold-light transition-colors"
          >
            {user?.player?.display_name || user?.username}
          </Text>
          <div className="h-px w-full bg-gold/10 self-end mt-0.5" />
        </div>

        <Button
          to={ROUTES.NAV_LOGOUT}
          variant="danger"
          size="sm"
          className="px-4"
        >
          Quitter
        </Button>
      </div>
    </nav>
  );
};
