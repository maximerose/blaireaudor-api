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
  type PlayerCompact,
  type PlayerSearchLogic,
} from '@/features/player';
import { useHistoricalSearchUI } from '@/features/account/hooks';
import { LinkedProfileCard } from './LinkedProfileCard';
import { AUTH_UI } from '@/features/account/constants';

export interface HistoricalSearchUIProps extends PlayerSearchLogic {
  onSelect: (player: Player | PlayerCompact) => void;
  onClear: () => void;
  onCloseSearch: () => void;
  isLinked: boolean;
  hasResults?: boolean;
  localGuests?: PlayerCompact[];
  isCompLoading?: boolean;
  hasJoinCode?: boolean;
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
    localGuests = [],
    hasJoinCode = false,
  } = searchProps;

  const { searchContainerRef } = useHistoricalSearchUI(
    results.length,
    onCloseSearch,
  );

  if (isLinked) {
    return <LinkedProfileCard name={selectedName} onClear={onClear} />;
  }

  const showLocalGuests =
    hasJoinCode && searchTerm.trim().length === 0 && localGuests.length > 0;

  return (
    <div className="relative" ref={searchContainerRef}>
      <Input
        label={
          showLocalGuests
            ? AUTH_UI.HISTORICAL.ONBOARDING_LABEL
            : AUTH_UI.HISTORICAL.LABEL
        }
        placeholder={
          showLocalGuests
            ? AUTH_UI.HISTORICAL.ONBOARDING_PLACEHOLDER
            : FORM.PLAYER.PLACEHOLDERS.SEARCH_PLAYER
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={searching ? ICONS.LOADING : ICONS.SEARCH}
        align="center"
        role="combobox"
        aria-expanded={results.length > 0 || showLocalGuests}
        aria-controls="historical-search-results"
      />

      {showLocalGuests && (
        <Card
          variant={CARD_VARIANT.DARK}
          padding="none"
          className="mt-2 border-gold shadow-2xl bg-dark animate-fade-in relative z-30"
        >
          <div className="p-2 bg-gold/10 text-center border-b border-gold-border">
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.GOLD}
              className="font-bold"
            >
              {AUTH_UI.HISTORICAL.ONBOARDING_GUESTS_TITLE}
            </Text>
          </div>
          <List className="max-h-60 overflow-y-auto">
            {localGuests.map((player) => (
              <PlayerSearchResultItem
                key={player.id}
                player={player}
                role="option"
                onClick={() => onSelect(player)}
                actionIcon={AUTH_UI.HISTORICAL.ACTION_SELECT}
              />
            ))}
          </List>
        </Card>
      )}

      {results.length > 0 && (
        <Card
          id="historical-search-results"
          role="listbox"
          variant={CARD_VARIANT.DARK}
          padding="none"
          className="absolute z-50 w-full mt-2 border-gold-border shadow-2xl bg-dark animate-slide-up"
        >
          <List className="max-h-72 overflow-y-auto">
            {results.map((player) => (
              <PlayerSearchResultItem
                key={player.id}
                player={player}
                role="option"
                onClick={() => onSelect(player)}
                actionIcon={AUTH_UI.HISTORICAL.ACTION_SELECT}
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
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="flex items-center">
                  {ICONS.CANCEL}
                </span>
                <span>{AUTH_UI.HISTORICAL.CLOSE_SEARCH}</span>
              </span>
            </Text>
          </button>
        </Card>
      )}
    </div>
  );
};
