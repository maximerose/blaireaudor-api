import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { playerService } from '@/features/player/services';
import { QUERY_KEYS, RULES, STALE_TIMES } from '@/shared';
import type { Player } from '@/features/player/types';

export interface PlayerSearchLogic {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: Player[];
  searching: boolean;
  clearSearch: () => void;
}

export const usePlayerSearch = (): PlayerSearchLogic => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, RULES.SEARCH.DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const cleanTerm = debouncedTerm.trim();

  const { data: results = [], isFetching: searching } = useQuery<Player[]>({
    queryKey: QUERY_KEYS.player.search(cleanTerm),
    queryFn: ({ signal }) => playerService.search(cleanTerm, signal),
    enabled: cleanTerm.length >= RULES.SEARCH.MIN_CHARS,
    staleTime: STALE_TIMES.MUTATION_CHECK,
  });

  return {
    searchTerm,
    setSearchTerm,
    results: cleanTerm.length < RULES.SEARCH.MIN_CHARS ? [] : results,
    searching,
    clearSearch: () => setSearchTerm(''),
  };
};
