import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useNavbarUI } from '@/shared/hooks';
import { ICONS, NAV } from '@/shared/constants';
import { cn } from '@/shared/utils';
import { SECTION_HEADER_VARIANT, SectionHeader } from './SectionHeader';
import { Text, TEXT_VARIANT, TEXT_THEME } from './Text';
import { Button, BUTTON_VARIANT, BUTTON_SIZE } from './Button';
import { Row, Stack } from '../Layout';

interface NavbarProps {
  subtitle?: string;
}

const LOGO_LINK =
  'flex flex-col group transition-default active:scale-95 focus-visible:ring-2 focus-visible:ring-gold-border focus-visible:outline-none rounded-lg p-1';

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
          'sticky top-0 z-40 w-full flex items-center justify-between border-b transition-all duration-300 ease-in-out px-4 sm:px-6',
          isScrolled
            ? 'bg-dark/95 backdrop-blur-md border-border-base shadow-lg'
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
            colorTheme={TEXT_THEME.MUTED}
            className={isScrolled ? 'text-center' : ''}
          >
            {subtitle}
          </Text>
        </Link>

        <Button
          variant={BUTTON_VARIANT.GHOST_NEUTRAL}
          onClick={() => setIsMenuOpen(true)}
          aria-label={NAV.ARIA.OPEN_MENU}
          aria-expanded={isMenuOpen}
          className="px-2"
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
      </nav>

      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
        )}
      >
        <div
          className="absolute inset-0 bg-overlay backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          className={cn(
            'absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-dark-lighter border-l border-border-subtle shadow-2xl flex flex-col transform transition-transform duration-300 ease-out',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <Row
            align="center"
            justify="between"
            p="lg"
            className="border-b border-border-subtle"
          >
            <Stack gap="none">
              <Text variant={TEXT_VARIANT.MICRO} colorTheme={TEXT_THEME.DIMMED}>
                {NAV.CONNECTED_AS}
              </Text>
              <Text
                variant={TEXT_VARIANT.H3}
                colorTheme={TEXT_THEME.GOLD}
                className="truncate"
              >
                {displayName}
              </Text>
            </Stack>

            <Button
              variant={BUTTON_VARIANT.GHOST_NEUTRAL}
              size={BUTTON_SIZE.SMALL}
              onClick={() => setIsMenuOpen(false)}
            >
              {ICONS.CANCEL}
            </Button>
          </Row>

          <div className="flex-1 py-4 flex flex-col">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-2',
                    isActive
                      ? 'bg-gold-soft border-gold text-gold'
                      : 'border-transparent text-text-muted hover:bg-surface-base hover:text-silver',
                  )}
                >
                  <span className="text-xl" aria-hidden="true">
                    {link.icon}
                  </span>
                  <Text
                    variant={TEXT_VARIANT.BODY}
                    colorTheme={TEXT_THEME.INHERIT}
                    className="font-bold tracking-wide"
                  >
                    {link.label}
                  </Text>
                </Link>
              );
            })}
          </div>

          <div className="p-6 border-t border-border-subtle">
            <Button
              variant={BUTTON_VARIANT.DANGER}
              to={ROUTES.NAV.LOGOUT}
              fullWidth
              size={BUTTON_SIZE.MEDIUM}
            >
              {NAV.LINK.LOGOUT}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
