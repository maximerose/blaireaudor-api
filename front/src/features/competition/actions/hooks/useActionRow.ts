import { useAuthContext } from '@/features/account';
import { ActionStatus, type Action } from '@/features/competition/types';
import { useCompetitionContext } from '@/features/competition/context';
import { UI } from '@/shared';

export const useActionRow = (action: Action) => {
  const { competition, isAdmin, getMultiplier } = useCompetitionContext();
  const { user } = useAuthContext();

  const playerName = action.player_name || UI.ANONYMOUS;

  const playerIsMe = action.player_id === user?.player?.id;
  const creatorIsMe = action.created_by_id === user?.id;

  const isPending = action.status?.toLowerCase() === ActionStatus.PENDING;
  const isPositive = action.points >= 0;
  const multiplier = getMultiplier(action.date_action) ?? 1;
  const finalPoints = action.points * multiplier;

  const canEdit =
    !competition.is_finished && (isAdmin || (isPending && creatorIsMe));
  const shouldHidePoints = competition.fog_of_war && !canEdit;

  const pointsDisplay = shouldHidePoints
    ? '??'
    : isPositive
      ? `+${finalPoints}`
      : finalPoints;

  const pointsColorClass = shouldHidePoints
    ? 'text-text-dimmed'
    : isPositive
      ? 'text-warning'
      : 'text-success-bright';

  const displayColor = shouldHidePoints
    ? 'text-text-dimmed'
    : multiplier > 1
      ? 'text-game-bonus-bright drop-shadow-[0_0_5px_var(--color-danger-bright)]'
      : pointsColorClass;

  return {
    isPending,
    pointsDisplay,
    displayColor,
    playerName,
    multiplier,
    playerIsMe,
    creatorIsMe,
    shouldHidePoints,
    canEdit,
  };
};
