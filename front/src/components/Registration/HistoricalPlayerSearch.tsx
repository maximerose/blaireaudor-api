import { useEffect, useRef } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { PlayerSearchResultItem } from '../UI/PlayerSearchResultItem';

interface Props {
  searchProps: {
    search: (query: string) => void;
    results: any[];
    searching: boolean;
    onSelect: (player: any) => void;
    onClear: () => void;
    onCloseSearch: () => void;
    isLinked: boolean;
  };
  selectedName?: string;
}

export const HistoricalPlayerSearch = ({
  searchProps,
  selectedName,
}: Props) => {
  const {
    search,
    results,
    searching,
    onSelect,
    onClear,
    onCloseSearch,
    isLinked,
  } = searchProps;
  const searchContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        results.length > 0 &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        onCloseSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [results, onCloseSearch]);

  if (isLinked) {
    return (
      <div className="mb-6 p-4 bg-green-500/10 border-green-500/30 rounded-2xl flex justify-between items-center animate-fade-in">
        <div>
          <p className="text-[10px] text-green-500 uppercase font-bold tracking-wider">
            Profil lié
          </p>
          <p className="text-white font-medium">{selectedName}</p>
        </div>
        <Button variant="ghost" size="sm" type="button" onClick={onClear}>
          Changer
        </Button>
      </div>
    );
  }

  return (
    <div className="relative mb-6" ref={searchContainerRef}>
      <Input
        label="Déjà participé ?"
        placeholder="Cherche ton nom..."
        onChange={(e) => search(e.target.value)}
        icon={searching ? '⏳' : '🔍'}
      />
      {results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-gold/30 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
          <div className="max-h-60 overflow-y-auto">
            {results.map((player) => (
              <PlayerSearchResultItem
                key={player.id}
                player={player}
                onClick={onSelect}
                actionIcon="C'EST MOI"
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onCloseSearch}
          >
            ✕ Je ne suis pas dans la liste
          </Button>
        </div>
      )}
    </div>
  );
};
