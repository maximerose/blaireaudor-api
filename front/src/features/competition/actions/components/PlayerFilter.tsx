import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Dropdown,
  cn,
  normalizeString,
  ICONS,
  UI,
  Row,
  Divider,
} from '@/shared';
import { useAuthContext } from '@/features/account/context/AuthContext';
import { COMPETITION_UI } from '@/features/competition/constants';
import {
  useActionTableContext,
  useCompetitionContext,
} from '@/features/competition/context';
import { usePermissions } from '@/features/competition/hooks';
import type { Participation } from '@/features/competition/types';

export const PlayerFilter = () => {
  const { selectedPlayerId, setSelectedPlayerId } = useActionTableContext();
  const { user } = useAuthContext();
  const { competition } = useCompetitionContext();
  const { roles } = usePermissions();

  const currentUserId = user?.player?.id;

  const otherPlayersOptions = (competition?.participations || [])
    .filter((p: Participation) => p.player.id !== currentUserId)
    .sort((a: Participation, b: Participation) => {
      const nameA = normalizeString(a.player.display_name);
      const nameB = normalizeString(b.player.display_name);
      return nameA.localeCompare(nameB, 'fr');
    })
    .map((p: Participation) => ({
      value: p.player.id,
      label: p.player.display_name,
    }));

  return (
    <Row wrap gap="sm" align="center" className="animate-fade-in">
      <Button
        variant={
          !selectedPlayerId ? BUTTON_VARIANT.SECONDARY : BUTTON_VARIANT.GHOST
        }
        size={BUTTON_SIZE.SMALL}
        onClick={() => setSelectedPlayerId(null)}
        className="cursor-pointer"
      >
        {UI.ALL}
      </Button>

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
            'transition-default cursor-pointer', // 🟢 Utilisation de ton token transition-default globale
            selectedPlayerId === currentUserId
              ? 'text-player-me border-player-me bg-me-soft'
              : 'text-player-me/40 hover:text-player-me border-transparent',
          )}
        >
          {UI.ME}
        </Button>
      )}

      <Divider orientation="vertical" className="h-4 self-center" />

      <Dropdown
        options={otherPlayersOptions}
        value={selectedPlayerId !== currentUserId ? selectedPlayerId : null}
        onChange={setSelectedPlayerId}
        placeholder={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.OTHER_PLAYERS}
      />
    </Row>
  );
};
