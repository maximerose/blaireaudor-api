import {
  ReportingProvider,
  useCompetitionContext,
} from '@/features/competition/context';
import { usePermissions } from '@/features/competition/hooks';
import { ReportingContent } from './ReportingContent';

export const ReportingSection = () => {
  const { competition } = useCompetitionContext();
  const { canReport } = usePermissions();

  if (competition.is_finished || !canReport.allowed) return null;

  return (
    <ReportingProvider>
      <ReportingContent />
    </ReportingProvider>
  );
};
