import { ActionTableContent } from '@/components/Competition';
import { ActionTableProvider, useCompetitionContext } from '@/context';

export const ActionTable = () => {
  const { competition } = useCompetitionContext();

  return (
    <ActionTableProvider competitionId={competition?.id}>
      <ActionTableContent />
    </ActionTableProvider>
  );
};
