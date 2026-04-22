import { useEffect, useRef } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { PlayerSearchResultItem } from '../UI/PlayerSearchResultItem';
import { Card } from '../UI/Card';
import { Text } from '../UI/Typography';

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [results, onCloseSearch]);

  if (isLinked) {
    return (
      <Card
        variant="glass"
        className="mb-8 p-5 border-success-bright/20 flex justify-between items-center bg-success/3 animate-fade-in"
      >
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success-bright animate-pulse" />
            <Text
              variant="caption"
              className="text-success-bright tracking-[0.2em]"
            >
              Profil lié
            </Text>
          </div>
          <Text variant="h3" as="p" className="text-white capitalize text-xl">
            {selectedName}
          </Text>
        </div>

        <Button variant="ghost" size="sm" type="button" onClick={onClear}>
          Changer
        </Button>
      </Card>
    );
  }

  return (
    <div className="relative mb-8" ref={searchContainerRef}>
      <Input
        label="Déjà participé ?"
        placeholder="Ton nom..."
        onChange={(e) => search(e.target.value)}
        icon={searching ? '⏳' : '🔍'}
        align="center"
      />

      {results.length > 0 && (
        <Card
          variant="dark"
          className="absolute z-50 w-full mt-2 border-gold/30 shadow-2xl overflow-hidden animate-slide-up bg-black/95 backdrop-blur-xl"
        >
          <div className="max-h-72 overflow-y-auto no-scrollbar divide-y divide-white/5">
            {results.map((player) => (
              <PlayerSearchResultItem
                key={player.id}
                player={player}
                onClick={onSelect}
                actionIcon="C'EST MOI"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onCloseSearch}
            className="w-full p-3 bg-white/ hover:bg-white/5 text-[9px] font-black uppercase tracking-widest text-gold hover:text-gold-dark transition-all border-t border-white/5"
          >
            ✕ Je ne suis pas dans cette liste
          </button>
        </Card>
      )}
    </div>
  );
};
