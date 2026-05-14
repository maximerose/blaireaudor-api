import { useReportAction } from '@/hooks';
import type { ReactNode } from 'react';
import {
  ReportActionContext,
  useCompetitionContext,
  useReportingContext,
} from '@/context';

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
