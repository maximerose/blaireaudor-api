import { useState, useMemo } from 'react';

interface Props {
  leaderboard: any[];
}

export const useReporting = ({ leaderboard }: Props) => {
  const [isReporting, setIsReporting] = useState(false);

  const potentialTargets = useMemo(
    () =>
      leaderboard?.map((item: any) => ({
        id: item.player.id,
        display_name: item.player.display_name,
      })) || [],
    [leaderboard],
  );

  const toggleReporting = () => setIsReporting((prev) => !prev);

  return {
    isReporting,
    toggleReporting,
    potentialTargets,
  };
};
