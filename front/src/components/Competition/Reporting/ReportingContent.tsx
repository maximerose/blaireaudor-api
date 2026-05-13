import { Badge, Button, Card, Text } from '@/components/UI';
import { COMPETITION_UI } from '@/constants';
import {
  CompetitionCountdown,
  ReportActionForm,
} from '@/components/Competition';
import { useReportingContext } from '@/context/ReportingContext';
import { useCompetition } from '@/hooks';

export const ReportingContent = () => {
  const { isReporting, toggleReporting } = useReportingContext();
  const { competition, getTodayBonus } = useCompetition();
  const todayBonus = getTodayBonus();

  if (!competition.has_started) {
    return (
      <section className="mb-10 max-w-2xl mx-auto animate-slide-up">
        <Card
          variant="dark"
          className="text-center p-4 border-dashed border-gold/10 max-w-md mx-auto"
        >
          <Text variant="h2" className="text-gold/30 italic font-medium">
            {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.NOT_STARTED_TITLE}
          </Text>
          <div className="mt-2 opacity-60">
            <Text variant="body" className="mt-2 opacity-60">
              {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.NOT_STARTED_SUBTITLE}
            </Text>
            <CompetitionCountdown
              targetDate={competition.start_date}
              elapsedText={
                COMPETITION_UI.DETAIL.SECTIONS.REPORTING.NOT_STARTED_ELAPSED
              }
            />
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-10 max-w-2xl mx-auto animate-slide-up space-y-4">
      {todayBonus && (
        <Card
          variant="dark"
          className="border-game-bonus-bright/30 bg-game-bonus/20 p-4 flex items-center gap-4 animate-pulse"
        >
          <div className="flex-1 flex items-center gap-4">
            <Badge variant="warning" className="text-xl">
              x{todayBonus.multiplier}
            </Badge>
            <div>
              <Text
                variant="caption"
                className="text-game-bonus-bright font-bold uppercase tracking-wider"
              >
                {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.BONUS_DAY}
              </Text>
              <Text as="p" variant="micro" className="opacity-70">
                {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.BONUS_HINT}
              </Text>
            </div>
          </div>
          <Badge variant="warning" className="text-xl">
            x{todayBonus.multiplier}
          </Badge>
        </Card>
      )}

      {!isReporting ? (
        <Button
          variant="primary"
          fullWidth
          size="md"
          className="group"
          onClick={() => toggleReporting()}
        >
          {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.REPORT_BUTTON}
        </Button>
      ) : (
        <ReportActionForm />
      )}
    </section>
  );
};
