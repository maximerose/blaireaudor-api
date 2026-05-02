import { Input, PlayerSearchResultItem, Card, Text } from '@/components/UI';
import { useHistoricalSearchUI } from '@/hooks';
import { LinkedProfileCard } from '@/components/Auth';

interface Props {
  searchProps: {
    searchTerm: string;
    setSearchTerm: (query: string) => void;
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
    searchTerm,
    setSearchTerm,
    results,
    searching,
    onSelect,
    onClear,
    onCloseSearch,
    isLinked,
  } = searchProps;

  const { searchContainerRef } = useHistoricalSearchUI(
    results.length,
    onCloseSearch,
  );

  if (isLinked) {
    return <LinkedProfileCard name={selectedName} onClear={onClear} />;
  }

  return (
    <div className="relative mb-8" ref={searchContainerRef}>
      <Input
        label="Déjà participé ?"
        placeholder="Ton nom d'affichage..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={searching ? '⏳' : '🔍'}
        align="center"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls="historical-search-results"
      />

      {results.length > 0 && (
        <Card
          id="historical-search-results"
          role="listbox"
          variant="dark"
          className="absolute z-50 w-full mt-2 border-gold/30 shadow-2xl overflow-hidden animate-slide-up bg-black/95 backdrop-blur-xl"
        >
          <div className="max-h-72 overflow-y-auto no-scrollbar divide-y divide-white/5">
            {results.map((player) => (
              <PlayerSearchResultItem
                key={player.id}
                player={player}
                role="option"
                onClick={onSelect}
                actionIcon="C'EST MOI"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onCloseSearch}
            className="w-full p-3 hover:bg-white/5 transition-default border-t border-white/5 flex justify-center cursor-pointer focus:bg-white/10 focus:outline-none"
            aria-label="Fermer la liste de recherche"
          >
            <Text variant="micro" className="text-gold opacity-100">
              <span aria-hidden="true">✕</span> Je ne suis pas dans cette liste
            </Text>
          </button>
        </Card>
      )}
    </div>
  );
};
