import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  FORM,
  cn,
  Row,
} from '@/shared';
import type { PlayerCompact } from '@/features/player';

interface PlayerDropdownListProps {
  filteredPlayers: PlayerCompact[];
  selectPlayer: (id: string, name: string) => void;
}

export const PlayerDropdownList = ({
  filteredPlayers,
  selectPlayer,
}: PlayerDropdownListProps) => (
  <Card
    id="report-search-results"
    role="listbox"
    padding="none"
    radius="lg"
    variant={CARD_VARIANT.DARK}
    className={cn(
      'absolute top-full left-0 right-0 mt-1 z-50 border-gold-border',
      'max-h-56 overflow-y-auto shadow-2xl bg-dark no-scrollbar',
      'animate-fade-in',
    )}
  >
    {filteredPlayers.length > 0 ? (
      <>
        {filteredPlayers.map((p) => (
          <button
            key={p.id}
            type="button"
            role="option"
            className="w-full p-3 text-center hover:bg-gold/10 border-b border-border-subtle transition-default group cursor-pointer focus:bg-gold/10 focus:outline-none"
            onClick={() => selectPlayer(p.id, p.display_name)}
          >
            <Text
              variant={TEXT_VARIANT.BODY}
              colorTheme={TEXT_THEME.GOLD}
              as="span"
              className="font-bold italic"
            >
              {p.display_name}
            </Text>
          </button>
        ))}
      </>
    ) : (
      <Row justify="center" className="p-4 w-full">
        <Text
          variant={TEXT_VARIANT.MICRO}
          colorTheme={TEXT_THEME.DIMMED}
          className="italic"
        >
          {FORM.PLAYER.HINT.NOT_FOUND}
        </Text>
      </Row>
    )}
  </Card>
);
