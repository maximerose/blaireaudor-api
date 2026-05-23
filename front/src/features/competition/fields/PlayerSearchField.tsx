import {
  Input,
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  ICONS,
  FORM,
} from '@/shared';
import { PlayerSearchResultItem, type PlayerCompact } from '@/features/player';

interface PlayerSearchFieldProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  results: PlayerCompact[];
  onSelect: (player: PlayerCompact) => void;
  onCreateNew?: (name: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const PlayerSearchField = ({
  searchTerm,
  setSearchTerm,
  isSearching,
  results,
  onSelect,
  onCreateNew,
  placeholder,
  disabled = false,
}: PlayerSearchFieldProps) => {
  const canCreate =
    onCreateNew &&
    searchTerm.trim().length >= 2 &&
    !results.some(
      (p) => p.display_name.toLowerCase() === searchTerm.trim().toLowerCase(),
    );
  const showDropdown =
    searchTerm.length >= 1 && (results.length > 0 || canCreate);

  return (
    <div className="relative z-50 w-full">
      <Input
        align="center"
        placeholder={placeholder || FORM.PLAYER.PLACEHOLDERS.SEARCH_OR_CREATE}
        value={searchTerm}
        disabled={disabled}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={isSearching ? ICONS.LOADING : ICONS.SEARCH}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        autoComplete="off"
      />

      {showDropdown && (
        <Card
          role="listbox"
          variant={CARD_VARIANT.DARK}
          padding="none"
          radius="lg"
          className="absolute top-full left-0 right-0 mt-2 border-gold-border shadow-2xl bg-dark-lighter max-h-64 overflow-y-auto no-scrollbar animate-fade-in"
        >
          <div className="divide-y divide-border-subtle">
            {canCreate && (
              <button
                type="button"
                onClick={() => onCreateNew(searchTerm)}
                className="w-full p-3 bg-gold/10 hover:bg-gold/20 cursor-pointer flex justify-between items-center group transition-default border-b border-border-subtle"
                role="option"
              >
                <div className="flex flex-col text-left">
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    className="text-gold font-bold"
                  >
                    {FORM.ADMIN.ENROLLMENT.CREATE_NEW(searchTerm)}
                  </Text>
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    className="italic opacity-60"
                  >
                    {FORM.ADMIN.ENROLLMENT.NEW_PLAYER_HINT}
                  </Text>
                </div>
                <div className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center text-gold group-hover:scale-110 transition-default">
                  {ICONS.ADD}
                </div>
              </button>
            )}

            {results.map((p) => (
              <PlayerSearchResultItem
                key={p.id}
                player={p}
                role="option"
                onClick={() => onSelect(p)}
                actionIcon={ICONS.ADD}
              />
            ))}

            {results.length === 0 && !canCreate && (
              <div className="p-4 text-center">
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  className="italic text-text-dimmed"
                >
                  {FORM.PLAYER.HINT.NOT_FOUND}
                </Text>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
