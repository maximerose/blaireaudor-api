import {
  Input,
  Card,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  CARD_VARIANT,
  FORM,
  ICONS,
  List,
} from '@/shared';
import {
  PlayerSearchResultItem,
  type Player,
  type PlayerSearchLogic,
} from '@/features/player';
import { useHistoricalSearchUI } from '@/features/account/hooks';
import { LinkedProfileCard } from './LinkedProfileCard';
import { AUTH_UI } from '@/features/account/constants';

export interface HistoricalSearchUIProps extends PlayerSearchLogic {
  onSelect: (player: Player) => void;
  onClear: () => void;
  onCloseSearch: () => void;
  isLinked: boolean;
  hasResults?: boolean;
}

interface HistoricalPlayerSearchProps {
  searchProps: HistoricalSearchUIProps;
  selectedName?: string;
}

export const HistoricalPlayerSearch = ({
  searchProps,
  selectedName,
}: HistoricalPlayerSearchProps) => {
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
    <div className="relative" ref={searchContainerRef}>
      <Input
        label={AUTH_UI.HISTORICAL.LABEL}
        placeholder={FORM.PLAYER.PLACEHOLDERS.SEARCH_PLAYER}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={searching ? ICONS.LOADING : ICONS.SEARCH}
        align="center"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls="historical-search-results"
      />

      {results.length > 0 && (
        <Card
          id="historical-search-results"
          role="listbox"
          variant={CARD_VARIANT.DARK}
          padding="none"
          className="absolute z-50 w-full mt-2 border-gold-border shadow-2xl bg-dark animate-slide-up"
        >
          <List className="max-h-72 overflow-y-auto no-scrollbar">
            {results.map((player) => (
              <PlayerSearchResultItem
                key={player.id}
                player={player}
                role="option"
                onClick={() => onSelect(player)}
                actionIcon={AUTH_UI.HISTORICAL.ACTION_SELECT}
                className="rounded-none first:rounded-t-xl"
              />
            ))}
          </List>

          <button
            type="button"
            onClick={onCloseSearch}
            className="w-full p-3 hover:bg-surface-base transition-default border-t border-border-subtle flex justify-center cursor-pointer focus:bg-surface-raised focus:outline-none rounded-b-xl"
            aria-label={AUTH_UI.HISTORICAL.CLOSE_SEARCH}
          >
            <Text variant={TEXT_VARIANT.MICRO} colorTheme={TEXT_THEME.GOLD}>
              <span className="mr-1" aria-hidden="true">
                {ICONS.CANCEL}
              </span>{' '}
              {AUTH_UI.HISTORICAL.CLOSE_SEARCH}
            </Text>
          </button>
        </Card>
      )}
    </div>
  );
};
