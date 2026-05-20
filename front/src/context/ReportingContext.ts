import { createContext, useContext } from 'react';
import type { ReportingContextType } from '@/context';
import { ERRORS } from '@/shared';

export const ReportingContext = createContext<ReportingContextType | undefined>(
  undefined,
);

export const useReportingContext = () => {
  const context = useContext(ReportingContext);
  if (!context)
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER(
        'useReportingContext',
        'ReportingProvider',
      ),
    );
  return context;
};
