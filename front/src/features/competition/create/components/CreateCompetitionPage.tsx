import { WizardLayout, Card, CARD_VARIANT } from '@/shared';
import { useCreateCompetitionPageUI } from '@/features/competition/create/hooks';
import { COMPETITION_UI } from '@/features/competition/constants';
import { CreateCompetitionView } from './CreateCompetitionView';

const FORM_WRAPPER =
  'w-full max-w-md p-8 rounded-[2.5rem] border-white/5 shadow-2xl';

export const CreateCompetitionPage = () => {
  const { handleSuccess } = useCreateCompetitionPageUI();

  return (
    <WizardLayout title={COMPETITION_UI.CREATE.TITLE}>
      <Card variant={CARD_VARIANT.GLASS} className={FORM_WRAPPER}>
        <CreateCompetitionView onSuccess={handleSuccess} />
      </Card>
    </WizardLayout>
  );
};
