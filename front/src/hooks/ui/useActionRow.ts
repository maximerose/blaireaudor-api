export const useActionRow = (action: any) => {
  const isPending = action.status?.toUpperCase() === 'PENDING';
  const isPositive = action.points >= 0;

  const pointsDisplay = isPositive ? `+${action.points}` : action.points;
  const pointsColorClass = isPositive ? 'text-danger' : 'text-success-bright';
  const playerName = action.player?.display_name || 'Anonyme';

  return {
    isPending,
    pointsDisplay,
    pointsColorClass,
    playerName,
  };
};
