import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useNavbarUI } from '@/hooks';
import {
  Button,
  BUTTON_VARIANT,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Text,
  TEXT_VARIANT,
} from '@/components/UI';
import { ICONS, NAV } from '@/constants';
import { cn } from '@/utils';

interface NavbarProps {
  subtitle?: string;
}

const LOGO_LINK =
  'flex flex-col group transition-default active:scale-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none rounded-lg p-1';

export const Navbar = ({ subtitle = NAV.SUBTITLE.PLAYER }: NavbarProps) => {
  const { displayName, isScrolled, isMenuOpen, setIsMenuOpen } = useNavbarUI();
  const location = useLocation();

  const navLinks = [
    { label: NAV.LINK.DASHBOARD, to: ROUTES.NAV.DASHBOARD, icon: ICONS.HOME },
    { label: NAV.LINK.PROFILE, to: ROUTES.NAV.PROFILE, icon: ICONS.PLAYER },
  ];

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-40 w-full flex items-center justify-between border-b transition-all duration-300 ease-in-out px-4',
          isScrolled
            ? ' bg-dark/95 backdrop-blur-md border-gold/10 shadow-lg'
            : 'bg-transparent border-transparent',
        )}
        aria-label={NAV.ARIA.MAIN_NAV}
      >
        <Link
          to={ROUTES.NAV.DASHBOARD}
          className={LOGO_LINK}
          aria-label={NAV.ARIA.HOME}
        >
          <div
            className={cn(
              'transition-all duration-300',
              isScrolled
                ? 'h-0 overflow-hidden opacity-0'
                : 'h-auto opacity-100',
            )}
          >
            <SectionHeader
              id="navbar-link-title"
              variant={SECTION_HEADER_VARIANT.BLOCK}
              title={NAV.TITLE}
              centered
              className="mb-0"
            />
          </div>

          <Text
            variant={TEXT_VARIANT.MICRO}
            className={isScrolled ? 'text-center' : ''}
          >
            {subtitle}
          </Text>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Button
            variant={BUTTON_VARIANT.GHOST}
            onClick={() => setIsMenuOpen(true)}
            className="relative p-2 text-gold/60 hover:text-gold transition-colors focus:outline-none"
            aria-label={NAV.ARIA.OPEN_MENU}
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </nav>

      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          className={cn(
            'absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-dark-lighter border-l border-white/5 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-white/40 uppercase"
              >
                {NAV.CONNECTED_AS}
              </Text>
              <Text variant={TEXT_VARIANT.H3} className="text-gold truncate">
                {displayName}
              </Text>
            </div>
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white transition-colors"
            >
              {ICONS.CANCEL}
            </Button>
          </div>

          <div className="flex-1 py-4 flex flex-col">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-6 py-4 transition-all duration-200 border-l-2',
                    isActive
                      ? 'bg-gold/10 border-gold text-gold'
                      : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl" aria-hidden="true">
                      {link.icon}
                    </span>
                    <span className="font-bold tracking-wide">
                      {link.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="p-6 border-t border-white/5">
            <Link
              to={ROUTES.NAV.LOGOUT}
              className="flex items-center gap-3 w-full p-3 rounded-xl bg-danger/10 text-danger-bright hover:bg-danger/20 transition-colors justify-center font-bold uppercase tracking-widest text-[10px]"
            >
              {NAV.LINK.LOGOUT}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
