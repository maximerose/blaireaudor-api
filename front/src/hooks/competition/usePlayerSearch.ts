import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { playerService } from '@/services/api/player';
import type { Player } from '@/types';

export const usePlayerSearch = (debounceDelay = 400) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceDelay);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  const { data: results = [], isFetching: searching } = useQuery<Player[]>({
    queryKey: ['players', 'search', debouncedTerm],
    queryFn: () => playerService.search(debouncedTerm),
    enabled: debouncedTerm.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  return {
    searchTerm,
    setSearchTerm,
    results: searchTerm.trim().length < 2 ? [] : results,
    searching,
    clearSearch: () => setSearchTerm(''),
  };
};
