import { Card, Text, TEXT_VARIANT, CARD_VARIANT, FORM } from '@/shared';
import { PlayerSearchResultItem, type PlayerCompact } from '@/features/player';

interface PlayerSearchResultsDropdownProps {
  results: PlayerCompact[];
  searchTerm?: string;
  onSelect: (player: PlayerCompact) => void;
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
    variant={CARD_VARIANT.DARK}
    className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden border-gold/30 bg-black/95 backdrop-blur-xl shadow-2xl max-h-64 overflow-y-auto"
  >
    <div className="divide-y divide-white/5">
      {searchTerm && searchTerm.length >= 1 && onCreateNew && (
        <div
          onClick={() => onCreateNew(searchTerm)}
          className="p-4 bg-gold/5 hover:bg-gold/10 cursor-pointer flex justify-between items-center group transition-default"
        >
          <div className="flex flex-col text-left">
            <Text
              variant={TEXT_VARIANT.MICRO}
              className="text-gold opacity-100"
            >
              {FORM.ADMIN.ENROLLMENT.CREATE_NEW(searchTerm)}
            </Text>
            <Text variant={TEXT_VARIANT.MICRO} className="italic opacity-30">
              {FORM.ADMIN.ENROLLMENT.NEW_PLAYER_HINT}
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
