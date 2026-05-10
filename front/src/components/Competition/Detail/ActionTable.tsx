import { useCompetition } from '@/hooks';
import { ActionTableContent } from '@/components/Competition';
import { ActionTableProvider } from '@/context/ActionTableProvider';

export const ActionTable = () => {
  const { competition } = useCompetition();

  return (
    <ActionTableProvider competitionId={competition?.id}>
      <ActionTableContent />
    </ActionTableProvider>
  );
};
