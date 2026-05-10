import { useCompetition, usePermissions } from '@/hooks';
import { ReportingProvider } from '@/context/ReportingProvider';
import { ReportingContent } from '@/components/Competition';

export const ReportingSection = () => {
  const { competition } = useCompetition();
  const { canReport } = usePermissions();

  if (competition.is_finished || !canReport.allowed) return null;

  return (
    <ReportingProvider>
      <ReportingContent />
    </ReportingProvider>
  );
};
