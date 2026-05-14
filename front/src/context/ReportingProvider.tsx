import { useMemo, useState } from 'react';
import { ReportingContext, useCompetitionContext } from '@/context';

export const ReportingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isReporting, setIsReporting] = useState(false);
  const { leaderboard } = useCompetitionContext();

  const potentialTargets = useMemo(
    () =>
      leaderboard.map((item) => ({
        id: item.player.id,
        display_name: item.player.display_name,
      })),
    [leaderboard],
  );

  const value = {
    isReporting,
    toggleReporting: () => setIsReporting((prev) => !prev),
    potentialTargets,
  };

  return (
    <ReportingContext.Provider value={value}>
      {children}
    </ReportingContext.Provider>
  );
};
