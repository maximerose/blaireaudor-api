import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useNavbarUI } from '@/hooks';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Text,
  TEXT_VARIANT,
} from '@/components/UI';

const NAV_CONTAINER =
  'w-full flex items-center justify-between py-6 border-b border-gold/10 animate-fade-in';
const LOGO_LINK =
  'flex flex-col group transition-default active:scale-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none rounded-lg p-1';
const LOGO_TEXT =
  'text-xl sm:text-2xl leading-none group-hover:text-gold-light transition-colors';
const USER_INFO_WRAPPER = 'text-right flex flex-col justify-center';
const USER_NAME_TEXT =
  'text-xs sm:text-sm italic tracking-tight group-hover:text-gold-light transition-colors';

export const Navbar = () => {
  const { displayName } = useNavbarUI();

  return (
    <nav className={NAV_CONTAINER} aria-label="Navigation principale">
      <Link
        to={ROUTES.NAV.DASHBOARD}
        className={LOGO_LINK}
        aria-label="Retour au tableau de bord Le Blaireau d'Or"
      >
        <Text
          variant={TEXT_VARIANT.H1}
          as="span"
          className={LOGO_TEXT}
          aria-hidden="true"
        >
          Le BLAIREAU D'OR
        </Text>
        <Text variant={TEXT_VARIANT.MICRO} className="mt-1" aria-hidden="true">
          Espace joueur
        </Text>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <div
          className={USER_INFO_WRAPPER}
          role="status"
          aria-label={`Connecté en tant que ${displayName}`}
        >
          <Text variant={TEXT_VARIANT.H3} as="span" className={USER_NAME_TEXT}>
            <span className="sr-only">Session de : </span>
            {displayName}
          </Text>
          <div
            className="h-px w-full bg-gold/10 self-end mt-0.5"
            aria-hidden="true"
          />
        </div>

        <Button
          to={ROUTES.NAV.LOGOUT}
          variant={BUTTON_VARIANT.DANGER}
          size={BUTTON_SIZE.SMALL}
          className="px-4 transition-default"
          aria-label="Se déconnecter de l'application"
        >
          Quitter
        </Button>
      </div>
    </nav>
  );
};
