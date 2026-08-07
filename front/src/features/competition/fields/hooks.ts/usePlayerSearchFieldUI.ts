import type { PlayerCompact } from '@/features/player';
import { useEffect, useRef, useState } from 'react';

interface UsePlayerSearchFieldProps {
  searchTerm: string;
  results: PlayerCompact[];
  onSelect: (player: PlayerCompact) => void;
  onCreateNew?: (name: string) => void;
}

export const usePlayerSearchFieldUI = ({
  searchTerm,
  results,
  onSelect,
  onCreateNew,
}: UsePlayerSearchFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const canCreate =
    onCreateNew &&
    searchTerm.trim().length >= 2 &&
    !results.some(
      (p) => p.display_name.toLowerCase() === searchTerm.trim().toLowerCase(),
    );

  const showDropdown =
    isOpen && searchTerm.length >= 1 && (results.length > 0 || canCreate);

  const handleSelect = (player: PlayerCompact) => {
    onSelect(player);
    setIsOpen(false);
  };

  const handleCreateNew = (name: string) => {
    if (onCreateNew) {
      onCreateNew(name);
      setIsOpen(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsOpen(true);
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return {
    showDropdown,
    containerRef,
    canCreate,
    handleSelect,
    handleCreateNew,
    handleFocus,
  };
};
