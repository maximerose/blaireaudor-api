import { useAuth, useCompetition } from '@/hooks';
import { ActionStatus, type Action } from '@/types';

export const useActionRow = (action: Action) => {
  const { hidePoints, getMultiplier } = useCompetition();
  const { user } = useAuth();

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
        ? 'text-danger'
        : 'text-success-bright';
  const displayColor =
    hidePoints && !creatorIsMe ? 'text-white/20' : pointsColorClass;

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
