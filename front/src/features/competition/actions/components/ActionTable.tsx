import {
  ActionTableProvider,
  useCompetitionContext,
} from '@/features/competition/context';
import { ActionTableContent } from './ActionTableContent';

export const ActionTable = () => {
  const { competition } = useCompetitionContext();

  return (
    <ActionTableProvider competitionId={competition?.id}>
      <ActionTableContent />
    </ActionTableProvider>
  );
};
