import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  ICONS,
  FORM,
  cn,
  Input,
} from '@/shared';
import { PlayerSearchResultItem, type PlayerCompact } from '@/features/player';
import { usePlayerSearchFieldUI } from './hooks.ts';

interface PlayerSearchFieldProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  results: PlayerCompact[];
  onSelect: (player: PlayerCompact) => void;
  onCreateNew?: (name: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'absolute' | 'inline';
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
  variant = 'absolute',
}: PlayerSearchFieldProps) => {
  const {
    showDropdown,
    containerRef,
    canCreate,
    openDropdown,
    handleSelect,
    handleCreateNew,
  } = usePlayerSearchFieldUI({ searchTerm, results, onSelect, onCreateNew });

  return (
    <div className="relative z-50 w-full" ref={containerRef}>
      <Input
        align="center"
        placeholder={placeholder || FORM.PLAYER.PLACEHOLDERS.SEARCH_OR_CREATE}
        value={searchTerm}
        disabled={disabled}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={openDropdown}
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
          className={cn(
            'border-gold-border shadow-2xl bg-dark-lighter max-h-64 overflow-y-auto animate-fade-in',
            variant === 'absolute'
              ? 'absolute top-full left-0 right-0 mt-2'
              : 'relative mt-2 w-full',
          )}
        >
          <div className="divide-y divide-border-subtle">
            {canCreate && (
              <button
                type="button"
                onClick={() => handleCreateNew(searchTerm)}
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
                onClick={() => handleSelect(p)}
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
