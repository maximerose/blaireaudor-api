import type { Participation } from '@/features/competition';
import { useState, useMemo } from 'react';

interface ReportingTarget {
  id: string;
  display_name: string;
}

interface UseReportingProps {
  leaderboard: Participation[];
}

export const useReporting = ({ leaderboard }: UseReportingProps) => {
  const [isReporting, setIsReporting] = useState(false);

  const potentialTargets = useMemo<ReportingTarget[]>(
    () =>
      leaderboard?.map((item) => ({
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
