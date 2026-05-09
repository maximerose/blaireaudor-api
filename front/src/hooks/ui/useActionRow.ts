import { useAuth, useCompetition } from '@/hooks';
import type { Action } from '@/types';

export const useActionRow = (action: Action) => {
  const { hidePoints, getMultiplier } = useCompetition();
  const { user } = useAuth();

  const isPending = action.status?.toUpperCase() === 'PENDING';
  const isPositive = action.points >= 0;
  const multiplier = getMultiplier(action.date_action) ?? 1;
  const finalPoints = action.points * multiplier;
  const pointsDisplay = hidePoints
    ? '??'
    : isPositive
      ? `+${finalPoints}`
      : finalPoints;
  const pointsColorClass = hidePoints
    ? 'text-white/20'
    : isPositive
      ? 'text-danger'
      : 'text-success-bright';

  const playerName = action.player_name || 'Anonyme';

  const displayColor = hidePoints ? 'text-white/20' : pointsColorClass;
  const playerIsMe = action.player_id === user?.player?.id;
  const creatorIsMe = action.created_by_id === user?.id;

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
