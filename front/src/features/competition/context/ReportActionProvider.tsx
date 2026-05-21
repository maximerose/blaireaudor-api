import type { ReactNode } from 'react';
import { useCompetitionContext } from './CompetitionContext';
import { useReportingContext } from './ReportingContext';
import { useReportAction } from '@/features/competition/reporting';
import { ReportActionContext } from './ReportActionContext';

export const ReportActionProvider = ({ children }: { children: ReactNode }) => {
  const { refresh } = useCompetitionContext();
  const { potentialTargets, toggleReporting } = useReportingContext();

  const value = useReportAction(potentialTargets, () => {
    toggleReporting();
    refresh();
  });

  return (
    <ReportActionContext.Provider value={value}>
      {children}
    </ReportActionContext.Provider>
  );
};
