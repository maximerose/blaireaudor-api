// front/src/shared/components/UI/Navbar.tsx

import { NotificationBell, useNotifications } from '@/features/notification';
import { ICONS, NAV } from '@/shared/constants';
import { ROUTES } from '@/shared/constants/routes';
import { useNavbarUI } from '@/shared/hooks';
import { BadgerLogo } from '@/shared/logo';
import { cn } from '@/shared/utils';
import { Link, useLocation } from 'react-router-dom';
import { Stack } from '../Layout';
import { Text, TEXT_THEME, TEXT_VARIANT } from './Text';

interface NavbarProps {
  subtitle?: string;
}

export const Navbar = ({ subtitle = NAV.SUBTITLE.PLAYER }: NavbarProps) => {
  const { isScrolled, isSuperAdmin, adminUrl, navLinks } = useNavbarUI();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  return (
    <>
      {/* 💻📱 Bandeau Supérieur Commun */}
      <nav
        className={cn(
          'sticky bg-black/95 top-0 z-40 w-full flex items-center justify-between border-b transition-all duration-300 ease-in-out px-4',
          isScrolled
            ? ' backdrop-blur-md h-12 py-1 border-border-base shadow-lg'
            : 'h-16 py-2 border-transparent',
        )}
        aria-label={NAV.ARIA.MAIN_NAV}
      >
        <Link
          to={ROUTES.NAV.DASHBOARD}
          className="flex flex-row items-center gap-2.5 rounded-lg p-1 outline-none transition-all duration-300"
        >
          <BadgerLogo
            isIcon
            className={cn(
              'transition-all duration-300 ease-in-out',
              isScrolled ? 'w-7 h-7' : 'w-10 h-10 md:w-12 md:h-12',
            )}
          />

          <Stack
            gap="none"
            align="start"
            className="transition-all duration-300"
          >
            <Text
              variant={TEXT_VARIANT.H2}
              colorTheme={TEXT_THEME.GOLD}
              className={cn(
                'text-lg sm:text-xl leading-none font-black tracking-tight italic transition-all duration-300 ease-in-out',
                isScrolled ? 'max-sm:hidden opacity-0' : 'block opacity-100',
              )}
            >
              {NAV.TITLE}
            </Text>

            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={isScrolled ? TEXT_THEME.GOLD : TEXT_THEME.MUTED}
              className={cn(
                'text-[10px] sm:text-xs font-bold transition-all duration-300 ease-in-out leading-none',
                isScrolled
                  ? 'max-sm:text-xs max-sm:font-black max-sm:tracking-wide mt-0'
                  : 'mt-0.5',
              )}
            >
              {subtitle}
            </Text>
          </Stack>
        </Link>

        {/* Droite Desktop uniquement */}
        <nav
          className={cn(
            'hidden md:flex items-center gap-6 transition-all duration-300 font-bold',
            isScrolled ? 'text-lg' : 'text-xl',
          )}
          aria-label={NAV.ARIA.MAIN_NAV}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'inline-block transition-colors',
                location.pathname === link.to
                  ? 'text-gold'
                  : 'text-text-muted hover:text-silver',
              )}
            >
              {link.icon}
            </Link>
          ))}
          {isSuperAdmin && (
            <a
              href={adminUrl}
              className="text-role-creator-bright hover:text-role-creator items-center"
            >
              {ICONS.SETTINGS}
            </a>
          )}
          <NotificationBell />
        </nav>
      </nav>

      {/* 📱 BARRE D'ONGLETS INFÉRIEURE MOBILE (Style Instagram Puro) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-border-subtle shadow-2xl px-2 pb-safe">
        <div className="flex justify-between items-center h-14 w-full max-w-md mx-auto text-2xl">
          {/* Onglets identiques et épurés de ton précédent commit */}
          <Link
            to={ROUTES.NAV.DASHBOARD}
            className={cn(
              'flex items-center justify-center flex-1 h-full transition-colors',
              location.pathname === ROUTES.NAV.DASHBOARD
                ? 'text-gold'
                : 'text-text-dimmed',
            )}
            aria-label={NAV.ARIA.HOME}
          >
            {ICONS.HOME}
          </Link>

          <Link
            to={ROUTES.NAV.STATS}
            className={cn(
              'flex items-center justify-center flex-1 h-full transition-colors',
              location.pathname === ROUTES.NAV.STATS
                ? 'text-gold'
                : 'text-text-dimmed',
            )}
          >
            {ICONS.STATS}
          </Link>

          <Link
            to={ROUTES.NAV.NOTIFICATIONS}
            className={cn(
              'flex items-center justify-center flex-1 h-full transition-colors relative',
              location.pathname === ROUTES.NAV.NOTIFICATIONS
                ? 'text-gold'
                : 'text-text-dimmed',
            )}
          >
            <span>
              {unreadCount > 0 ? ICONS.NOTIFICATION_ON : ICONS.NOTIFICATION}
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-4 right-7 w-2 h-2 bg-danger-bright rounded-full shadow-[0_0_6px_var(--color-danger-bright)]" />
            )}
          </Link>

          <Link
            to={ROUTES.NAV.PROFILE}
            className={cn(
              'flex items-center justify-center flex-1 h-full transition-colors',
              location.pathname === ROUTES.NAV.PROFILE
                ? 'text-gold'
                : 'text-text-dimmed',
            )}
          >
            {ICONS.PLAYER}
          </Link>

          {isSuperAdmin && (
            <a
              href={adminUrl}
              className="flex items-center justify-center flex-1 h-full text-role-creator-bright opacity-80 hover:opacity-100"
            >
              {ICONS.SETTINGS}
            </a>
          )}
        </div>
      </div>
    </>
  );
};
