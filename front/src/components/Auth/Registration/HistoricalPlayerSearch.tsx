import {
  Input,
  PlayerSearchResultItem,
  Card,
  Text,
  TEXT_VARIANT,
  CARD_VARIANT,
} from '@/components/UI';
import { useHistoricalSearchUI, type PlayerSearchLogic } from '@/hooks';
import { LinkedProfileCard } from '@/components/Auth';
import type { Player } from '@/types';
import { AUTH_UI, ICONS, FORM } from '@/constants';

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
    <div className="relative mb-8" ref={searchContainerRef}>
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
          className="absolute z-50 w-full mt-2 border-gold/30 shadow-2xl overflow-hidden animate-slide-up bg-black/95 backdrop-blur-xl"
        >
          <div className="max-h-72 overflow-y-auto no-scrollbar divide-y divide-white/5">
            {results.map((player) => (
              <PlayerSearchResultItem
                key={player.id}
                player={player}
                role="option"
                onClick={() => onSelect(player)}
                actionIcon={AUTH_UI.HISTORICAL.ACTION_SELECT}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onCloseSearch}
            className="w-full p-3 hover:bg-white/5 transition-default border-t border-white/5 flex justify-center cursor-pointer focus:bg-white/10 focus:outline-none"
            aria-label={AUTH_UI.HISTORICAL.CLOSE_SEARCH}
          >
            <Text
              variant={TEXT_VARIANT.MICRO}
              className="text-gold opacity-100"
            >
              <span aria-hidden="true">{ICONS.CANCEL}</span>{' '}
              {AUTH_UI.HISTORICAL.CLOSE_SEARCH}
            </Text>
          </button>
        </Card>
      )}
    </div>
  );
};
