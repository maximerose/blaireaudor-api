import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Dropdown,
  cn,
  normalizeString,
  ICONS,
  UI,
} from '@/shared';
import { COMPETITION_UI } from '@/constants';
import { usePermissions } from '@/hooks';
import { useActionTableContext, useCompetitionContext } from '@/context';
import { useAuthContext } from '@/features/account';

export const PlayerFilter = () => {
  const { selectedPlayerId, setSelectedPlayerId } = useActionTableContext();
  const { user } = useAuthContext();
  const { competition } = useCompetitionContext();
  const { roles } = usePermissions();

  const currentUserId = user?.player?.id;

  const otherPlayersOptions = (competition?.participations || [])
    .filter((p) => p.player.id !== currentUserId)
    .sort((a, b) => {
      const nameA = normalizeString(a.player.display_name);
      const nameB = normalizeString(b.player.display_name);

      return nameA.localeCompare(nameB, 'fr');
    })
    .map((p) => ({
      value: p.player.id,
      label: p.player.display_name,
    }));

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
      {/* Bouton "Tous" */}
      <Button
        variant={
          !selectedPlayerId ? BUTTON_VARIANT.SECONDARY : BUTTON_VARIANT.GHOST
        }
        size={BUTTON_SIZE.SMALL}
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
          variant={
            selectedPlayerId === currentUserId
              ? BUTTON_VARIANT.SECONDARY
              : BUTTON_VARIANT.GHOST
          }
          size={BUTTON_SIZE.SMALL}
          onClick={() => setSelectedPlayerId(currentUserId)}
          icon={ICONS.PLAYER}
          className={cn(
            'transition-all duration-300',
            selectedPlayerId === currentUserId
              ? 'text-player-me border-player-me bg-player-me-bg'
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
