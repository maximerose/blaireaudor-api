import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context';

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

  return {
    displayName: user?.player?.display_name || user?.username,
    isMenuOpen,
    setIsMenuOpen,
    isScrolled,
  };
};
