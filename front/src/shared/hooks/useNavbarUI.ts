import { useState, useEffect } from 'react';
import { useAuthContext } from '@/features/account';
import { ICONS, NAV, ROUTES } from '../constants';

export const useNavbarUI = () => {
  const { user } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSuperAdmin = user?.roles?.includes('ROLE_SUPER_ADMIN') ?? false;
  const adminUrl = ROUTES.NAV.ADMIN_BASE;

  const navLinks = [
    {
      label: NAV.LINK.DASHBOARD,
      to: ROUTES.NAV.DASHBOARD,
      icon: ICONS.HOME,
      isActive: location.pathname === ROUTES.NAV.DASHBOARD,
    },
    {
      label: NAV.LINK.PROFILE,
      to: ROUTES.NAV.PROFILE,
      icon: ICONS.PLAYER,
      isActive: location.pathname === ROUTES.NAV.PROFILE,
    },
  ];
  return {
    displayName: user?.player?.display_name || user?.username,
    isMenuOpen,
    setIsMenuOpen,
    isScrolled,
    isSuperAdmin,
    adminUrl,
    navLinks,
  };
};
