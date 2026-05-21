import {
  ActionTableContent,
  ActionTableProvider,
  useCompetitionContext,
} from '@/features/competition';

export const ActionTable = () => {
  const { competition } = useCompetitionContext();

  return (
    <ActionTableProvider competitionId={competition?.id}>
      <ActionTableContent />
    </ActionTableProvider>
  );
};
