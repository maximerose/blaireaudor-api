// front/src/shared/hooks/useNavbarUI.ts

import { useAuthContext } from '@/features/account/context/AuthContext';
import { useEffect, useState } from 'react';
import { ICONS, NAV, ROUTES } from '../constants';

export const useNavbarUI = () => {
  const { user } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);

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
    },
    {
      label: NAV.LINK.STATS,
      to: ROUTES.NAV.STATS,
      icon: ICONS.STATS,
    },
    {
      label: NAV.LINK.PROFILE,
      to: ROUTES.NAV.PROFILE,
      icon: ICONS.PLAYER,
    },
  ];

  return {
    displayName: user?.player?.display_name || user?.username,
    isScrolled,
    isSuperAdmin,
    adminUrl,
    navLinks,
  };
};
