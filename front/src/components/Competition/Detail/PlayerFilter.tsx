import { Button, Dropdown } from '@/components/UI';
import { cn } from '@/utils';
import { COMPETITION_UI, ICONS, UI } from '@/constants';
import { useAuth, useCompetition, usePermissions } from '@/hooks';
import { useActionTableContext } from '@/context/ActionTableContext';

export const PlayerFilter = () => {
  const { selectedPlayerId, setSelectedPlayerId } = useActionTableContext();
  const { user } = useAuth();
  const { competition } = useCompetition();
  const { roles } = usePermissions();

  const currentUserId = user?.player?.id;

  const otherPlayersOptions = (competition?.participations || [])
    .filter((p) => p.player.id !== currentUserId)
    .map((p) => ({
      value: p.player.id,
      label: p.player.display_name,
    }));

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
      {/* Bouton "Tous" */}
      <Button
        variant={!selectedPlayerId ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setSelectedPlayerId(null)}
        className={cn(
          !selectedPlayerId && 'bg-white/10 border-white/20 text-white',
        )}
      >
        {UI.ALL}
      </Button>

      {/* Raccourci "Moi" en Gold */}
      {currentUserId && roles.isParticipant && (
        <Button
          variant={selectedPlayerId === currentUserId ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setSelectedPlayerId(currentUserId)}
          icon={ICONS.PLAYER}
          className={cn(
            'transition-all duration-300',
            selectedPlayerId === currentUserId
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
        value={selectedPlayerId !== currentUserId ? selectedPlayerId : null}
        onChange={setSelectedPlayerId}
        placeholder={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.OTHER_PLAYERS}
      />
    </div>
  );
};
