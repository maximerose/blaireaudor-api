import { CreateCompetitionView } from '@/components/Competition';
import { Card } from '@/components/UI';
import { useCreateCompetitionPageUI } from '@/hooks';

const PAGE_CONTAINER =
  'min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in motion-reduce:animate-none';
const FORM_WRAPPER =
  'w-full max-w-md p-8 rounded-[2.5rem] border-white/5 shadow-2xl';

export const CreateCompetitionPage = () => {
  const { handleSuccess } = useCreateCompetitionPageUI();

  return (
    <main className={PAGE_CONTAINER} aria-label="Création d'une nouvelle arène">
      <Card variant="glass" className={FORM_WRAPPER}>
        <CreateCompetitionView onSuccess={handleSuccess} />
      </Card>
    </main>
  );
};
