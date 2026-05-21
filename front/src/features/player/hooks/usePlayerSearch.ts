import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { playerService } from '@/features/player/services';
import { QUERY_KEYS } from '@/shared';
import type { Player } from '@/features/player/types';

export interface PlayerSearchLogic {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: Player[];
  searching: boolean;
  clearSearch: () => void;
}

export const usePlayerSearch = (debounceDelay = 400): PlayerSearchLogic => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  const { data: results = [], isFetching: searching } = useQuery<Player[]>({
    queryKey: QUERY_KEYS.player.search(debouncedTerm),
    queryFn: ({ signal }) => playerService.search(debouncedTerm, signal),
    enabled: debouncedTerm.trim().length >= 2,
    staleTime: 1000 * 60 * 2,
  });

  return {
    searchTerm,
    setSearchTerm,
    results: searchTerm.trim().length < 2 ? [] : results,
    searching,
    clearSearch: () => setSearchTerm(''),
  };
};
