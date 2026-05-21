import { createContext, useContext } from 'react';
import type { ReportActionContextType } from '@/features/competition';
import { ERRORS } from '@/shared';

export const ReportActionContext = createContext<
  ReportActionContextType | undefined
>(undefined);

export const useReportActionContext = () => {
  const context = useContext(ReportActionContext);
  if (!context)
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER(
        'useReportActionContext',
        'ReportActionProvider',
      ),
    );
  return context;
};
