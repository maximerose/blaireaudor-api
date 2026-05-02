import { useCompetition } from "@/context/CompetitionContext";

export const useActionRow = (action: any) => {
  const { hidePoints, getMultiplier } = useCompetition();

  const isPending = action.status?.toUpperCase() === 'PENDING';
  const isPositive = action.points >= 0;
  const multiplier = getMultiplier(action.date_action) ?? 1;
  const finalPoints = action.points * multiplier;
  const pointsDisplay = hidePoints ? '??' : (isPositive ? `+${finalPoints}` : finalPoints);
  const pointsColorClass = hidePoints ? 'text-white/20' : (isPositive ? 'text-danger' : 'text-success-bright');

  const playerName = action.player?.display_name || 'Anonyme';

  const displayColor = hidePoints ? 'text-white/20' : pointsColorClass;

  return {
    isPending,
    pointsDisplay,
    displayColor,
    playerName,
    multiplier,
  };
};
