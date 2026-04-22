import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';
import { Text } from './Typography';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between py-6 mb-8 border-b border-gold/10 animate-fade-in">
      <Link
        to={ROUTES.NAV_DASHBOARD}
        className="flex flex-col group transition-transform active:scale-95"
      >
        <Text
          variant="h1"
          as="span"
          className="text-xl sm:text-2xl leading-none group-hover:text-gold-light transition-colors"
        >
          BLAIREAU D'OR
        </Text>
        <Text
          variant="caption"
          className="text-[7px] sm:text-[8px] tracking-[0.4em] mt-0.5 opacity-60 uppercase"
        >
          Compétition & Arènes
        </Text>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="text-right flex flex-col justify-center">
          <Text
            variant="h3"
            as="span"
            className="text-xs sm:text-sm font-black italic tracking-tighter text-gold group-hover:text-gold-light transition-colors"
          >
            {user?.player?.display_name || user?.username}
          </Text>
          <div className="h-px w-full bg-gold/10 self-end mt-0.5" />
        </div>

        <Button
          as={Link}
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
