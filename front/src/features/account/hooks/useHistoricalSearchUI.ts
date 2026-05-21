import { useEffect, useRef } from 'react';

export const useHistoricalSearchUI = (
  resultsLength: number,
  onCloseSearch: () => void,
) => {
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsLength > 0 &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        onCloseSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [resultsLength, onCloseSearch]);

  return { searchContainerRef };
};
