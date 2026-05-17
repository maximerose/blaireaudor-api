import { useAuthContext, useCompetitionContext } from '@/context';
import { ActionStatus, type Action } from '@/types';

export const useActionRow = (action: Action) => {
  const { hidePoints, getMultiplier } = useCompetitionContext();
  const { user } = useAuthContext();

  const playerName = action.player_name || 'Anonyme';

  const playerIsMe = action.player_id === user?.player?.id;
  const creatorIsMe = action.created_by_id === user?.id;

  const isPending = action.status?.toLowerCase() === ActionStatus.PENDING;
  const isPositive = action.points >= 0;
  const multiplier = getMultiplier(action.date_action) ?? 1;
  const finalPoints = action.points * multiplier;
  const pointsDisplay =
    hidePoints && !creatorIsMe
      ? '??'
      : isPositive
        ? `+${finalPoints}`
        : finalPoints;
  const pointsColorClass =
    hidePoints && !creatorIsMe
      ? 'text-white/20'
      : isPositive
        ? 'text-warning'
        : 'text-success-bright';
  const displayColor =
    hidePoints && !creatorIsMe
      ? 'text-white/20'
      : multiplier > 1 && !hidePoints
        ? 'text-game-bonus-bright drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]'
        : pointsColorClass;

  return {
    isPending,
    pointsDisplay,
    displayColor,
    playerName,
    multiplier,
    playerIsMe,
    creatorIsMe,
  };
};
