import { usePermissions } from '@/hooks';
import { ReportingContent } from '@/components/Competition';
import { ReportingProvider, useCompetitionContext } from '@/context';

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
