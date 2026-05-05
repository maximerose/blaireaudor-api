import { Card, Text } from '@/components/UI';
import { FORM } from '@/constants';

interface PlayerDropdownListProps {
  filteredPlayers: any[];
  selectPlayer: (id: string, name: string) => void;
}

export const PlayerDropdownList = ({
  filteredPlayers,
  selectPlayer,
}: PlayerDropdownListProps) => (
  <Card
    id="report-search-results"
    role="listbox"
    variant="dark"
    className="absolute top-full left-0 right-0 mt-1 z-50 border-gold/30 max-h-48 overflow-y-auto shadow-2xl bg-black/95 backdrop-blur-xl animate-fade-in no-scrollbar"
  >
    {filteredPlayers.length > 0 ? (
      filteredPlayers.map((p) => (
        <button
          key={p.id}
          type="button"
          role="option"
          className="w-full p-3 text-center hover:bg-gold/10 text-gold border-b border-white/5 transition-default font-bold italic group cursor-pointer focus:bg-gold/10 focus:outline-none"
          onClick={() => selectPlayer(p.id, p.display_name)}
        >
          <Text
            variant="body"
            as="span"
            className="group-hover:text-gold transition-default font-bold"
          >
            {p.display_name}
          </Text>
        </button>
      ))
    ) : (
      <div className="p-4 text-center">
        <Text variant="micro" className="opacity-40 italic">
          {FORM.PLAYER.HINT.NOT_FOUND}
        </Text>
      </div>
    )}
  </Card>
);
