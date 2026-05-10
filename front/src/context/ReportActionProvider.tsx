import { useReportAction } from '@/hooks';
import { useCompetition } from './CompetitionContext';
import { ReportActionContext } from './ReportActionContext';
import { useReportingContext } from './ReportingContext';
import type { ReactNode } from 'react';

export const ReportActionProvider = ({ children }: { children: ReactNode }) => {
  const { refresh } = useCompetition();
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
