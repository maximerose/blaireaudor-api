import {
  Input,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  FORM,
  ICONS,
  List,
} from '@/shared';
import { PlayerSearchResultItem, type Player } from '@/features/player';
import { COMPETITION_UI } from '@/features/competition/constants';

interface RefereeSearchFieldProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  searchResults: Player[];
  onSelectPlayer: (player: Player) => void;
  disabled?: boolean;
}

export const RefereeSearchField = ({
  searchQuery,
  setSearchQuery,
  isSearching,
  searchResults,
  onSelectPlayer,
  disabled = false,
}: RefereeSearchFieldProps) => {
  return (
    <div className="relative z-10 w-full sm:max-w-md">
      <div className="relative w-full">
        <Input
          type="text"
          value={searchQuery}
          disabled={disabled}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={FORM.PLAYER.PLACEHOLDERS.SEARCH_PLAYER}
          autoComplete="off"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dimmed hover:text-silver p-1 cursor-pointer transition-colors"
            aria-label="Effacer la recherche"
          >
            {ICONS.CANCEL}
          </button>
        )}
      </div>

      {isSearching && (
        <Text
          variant={TEXT_VARIANT.MICRO}
          colorTheme={TEXT_THEME.DIMMED}
          className="absolute right-10 top-3"
        >
          <span className="inline-block animate-spin">{ICONS.LOADING}</span>
        </Text>
      )}

      {searchResults.length > 0 && (
        <List
          as="ul"
          className="absolute z-50 mt-2 w-full bg-dark-lighter border border-border-base rounded-xl shadow-2xl max-h-60 overflow-y-auto list-none p-0 left-0"
        >
          {searchResults.map((player) => (
            <li key={player.id} className="m-0">
              <PlayerSearchResultItem
                player={player}
                onClick={() => onSelectPlayer(player)}
                actionIcon={
                  <span className="text-[10px] uppercase font-bold text-black bg-gold px-2 py-1 rounded shadow">
                    {COMPETITION_UI.ADMIN.REFEREE.APPOINT}
                  </span>
                }
                className="w-full text-left p-3 hover:bg-surface-base transition-colors border-none"
              />
            </li>
          ))}
        </List>
      )}

      {searchQuery.length >= 2 &&
        !isSearching &&
        searchResults.length === 0 && (
          <Text
            variant={TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.DIMMED}
            className="italic mt-2 px-1 block text-center animate-fade-in"
          >
            {FORM.PLAYER.HINT.NOT_FOUND}
          </Text>
        )}
    </div>
  );
};
