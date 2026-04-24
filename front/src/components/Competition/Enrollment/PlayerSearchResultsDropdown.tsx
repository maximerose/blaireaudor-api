import { Card, Text, PlayerSearchResultItem } from '@/components/UI';

interface PlayerSearchResultsDropdownProps {
  results: any[];
  searchTerm?: string;
  onSelect: (player: any) => void;
  onCreateNew?: (name: string) => void;
}

export const PlayerSearchResultsDropdown = ({
  results,
  searchTerm,
  onSelect,
  onCreateNew,
}: PlayerSearchResultsDropdownProps) => (
  <Card
    id="enrollment-search-results"
    role="listbox"
    variant="dark"
    className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden border-gold/30 bg-black/95 backdrop-blur-xl shadow-2xl max-h-64 overflow-y-auto no-scrollbar"
  >
    <div className="divide-y divide-white/5">
      {searchTerm && searchTerm.length >= 1 && onCreateNew && (
        <div
          onClick={() => onCreateNew(searchTerm)}
          className="p-4 bg-gold/5 hover:bg-gold/10 cursor-pointer flex justify-between items-center group transition-default"
        >
          <div className="flex flex-col text-left">
            <Text variant="micro" className="text-gold opacity-100">
              Créer le profil "{searchTerm}"
            </Text>
            <Text variant="micro" className="italic opacity-30">
              Nouveau joueur
            </Text>
          </div>
          <div className="w-6 h-6 rounded-full border border-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-default">
            +
          </div>
        </div>
      )}

      {results.map((p) => (
        <PlayerSearchResultItem
          key={p.id}
          player={p}
          onClick={() => onSelect(p)}
          actionIcon="+"
        />
      ))}
    </div>
  </Card>
);
