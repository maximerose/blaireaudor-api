import {
  ReportingContent,
  ReportingProvider,
  useCompetitionContext,
  usePermissions,
} from '@/features/competition';

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
