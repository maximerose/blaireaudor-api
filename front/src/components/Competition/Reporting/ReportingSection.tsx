import { Button, Card, Text } from '@/components/UI';
import { useReporting, useCompetition } from '@/hooks';
import {
  CompetitionCountdown,
  ReportActionForm,
} from '@/components/Competition';

export const ReportingSection = ({
  competition,
  leaderboard,
  isReferee,
  refresh,
}: any) => {
  const { isReporting, toggleReporting, potentialTargets } = useReporting({
    leaderboard,
  });
  const { getTodayBonus } = useCompetition();
  const todayBonus = getTodayBonus();

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
              targetDate={competition.start_date}
              elapsedText="lancée !"
            />
          </Text>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-10 max-w-2xl mx-auto animate-slide-up space-y-4">
      {todayBonus && (
        <Card
          variant="dark"
          className="border-danger-bright/30 bg-danger-dark/20 p-4 flex items-center gap-4 animate-pulse"
        >
          <span className="text-3xl">🔥</span>
          <div className="flex-1">
            <Text
              as="p"
              variant="caption"
              className="text-danger-bright font-black uppercase tracking-tighter"
            >
              Attention : Multiplicateur x{todayBonus.multiplier} activé !
            </Text>
            <Text as="p" variant="micro" className="opacity-70 leading-tight">
              Indiquez le score de base de l'action, le bonus sera calculé
              automatiquement dans le journal.
            </Text>
          </div>
          <span className="text-3xl">🔥</span>
        </Card>
      )}
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
