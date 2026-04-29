import { Button, Card, Text } from '@/components/UI';
import { useReporting } from '@/hooks';
import { CompetitionCountdown, ReportActionForm } from '@/components/Competition';

export const ReportingSection = ({
  competition,
  leaderboard,
  isReferee,
  refresh,
}: any) => {
  const { isReporting, toggleReporting, potentialTargets } = useReporting({
    leaderboard,
  });

  if (competition.is_finished) return null;

  if (!competition.has_started) {
    return (
      <section className="mb-10 max-w-2xl mx-auto animate-slide-up">
        <Card
          variant="dark"
          className="text-center p-4 border-dashed border-gold/10 max-w-md mx-auto"
        >
          <Text variant="h2" className="text-gold/30 italic font-medium">
            L'heure de la délation n'a pas sonné...
          </Text>
          <Text variant="body" className="mt-2 opacity-60">
            Ouverture{' '}
            <CompetitionCountdown
              startDate={competition.start_date}
              onStart={refresh}
            />
          </Text>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-10 max-w-2xl mx-auto animate-slide-up">
      {!isReporting ? (
        <Button
          variant="danger"
          fullWidth
          size="md"
          className="group"
          onClick={() => toggleReporting()}
        >
          <span className="text-xl mr-4 group-hover:animate-bounce">🚨</span>
          <span className="tracking-widest">Dénoncer un adversaire</span>
        </Button>
      ) : (
        <ReportActionForm
          competition={competition}
          players={potentialTargets}
          isAdmin={isReferee}
          onCancel={() => toggleReporting()}
          onSuccess={() => {
            toggleReporting();
            refresh();
          }}
        />
      )}
    </section>
  );
};
