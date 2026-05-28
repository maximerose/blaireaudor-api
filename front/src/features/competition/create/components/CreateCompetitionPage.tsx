import { WizardLayout, CARD_VARIANT, WizardCard } from '@/shared';
import { useCreateCompetitionPageUI } from '@/features/competition/create/hooks';
import { COMPETITION_UI } from '@/features/competition/constants';
import { CreateCompetitionView } from './CreateCompetitionView';

export const CreateCompetitionPage = () => {
  const { handleSuccess } = useCreateCompetitionPageUI();

  return (
    <WizardLayout title={COMPETITION_UI.CREATE.TITLE}>
      <WizardCard variant={CARD_VARIANT.GLASS}>
        <CreateCompetitionView onSuccess={handleSuccess} />
      </WizardCard>
    </WizardLayout>
  );
};

export default CreateCompetitionPage;
