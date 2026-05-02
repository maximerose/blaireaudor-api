import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api/config';
import { ROUTES } from '@/constants/routes';

export const usePlayerSearch = (debounceDelay = 400) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  const { data: results = [], isFetching: searching } = useQuery({
    queryKey: ['players', 'search', debouncedTerm],
    queryFn: async () => {
      const response = await apiFetch(ROUTES.API_SEARCH_PLAYERS(debouncedTerm));
      if (!response.ok) throw new Error('Erreur lors de la recherche');

      const data = await response.json();
      return Array.isArray(data)
        ? data
        : data['hydra:member'] || data.member || [];
    },
    enabled: debouncedTerm.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  return {
    searchTerm,
    setSearchTerm,
    results: searchTerm.trim().length < 2 ? [] : results,
    searching,
  };
};
