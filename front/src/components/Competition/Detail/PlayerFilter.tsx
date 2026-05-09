import { Button, Dropdown } from '@/components/UI';
import { cn } from '@/utils';
import { COMPETITION_UI, ICONS, UI } from '@/constants';

interface PlayerFilterProps {
  players: { id: string; display_name: string }[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  currentUserId?: string;
}

export const PlayerFilter = ({
  players,
  selectedId,
  onSelect,
  currentUserId,
}: PlayerFilterProps) => {
  const otherPlayersOptions = players
    .filter((p) => p.id !== currentUserId)
    .map((p) => ({
      value: p.id,
      label: p.display_name,
    }));

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
      {/* Bouton "Tous" */}
      <Button
        variant={!selectedId ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onSelect(null)}
        className={cn(!selectedId && 'bg-white/10 border-white/20 text-white')}
      >
        {UI.ALL}
      </Button>

      {/* Raccourci "Moi" en Gold */}
      {currentUserId && (
        <Button
          variant={selectedId === currentUserId ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onSelect(currentUserId)}
          icon={ICONS.PLAYER}
          className={cn(
            'transition-all duration-300',
            selectedId === currentUserId
              ? 'text-player-me border-player-me bg-player-me/10'
              : 'text-player-me/40 hover:text-player-me border-transparent',
          )}
        >
          {UI.ME}
        </Button>
      )}

      <div className="h-4 w-px bg-white/10 mx-1" />

      <Dropdown
        options={otherPlayersOptions}
        value={selectedId !== currentUserId ? selectedId : null}
        onChange={onSelect}
        placeholder={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.OTHER_PLAYERS}
      />
    </div>
  );
};
