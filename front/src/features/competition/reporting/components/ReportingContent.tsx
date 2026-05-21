import {
  Badge,
  BADGE_VARIANT,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
} from '@/shared';
import {
  useCompetitionContext,
  useReportingContext,
} from '@/features/competition/context';
import { COMPETITION_UI } from '@/features/competition/constants';
import { CompetitionCountdown } from '@/features/competition/view';
import { ReportActionForm } from './ReportActionForm';

export const ReportingContent = () => {
  const { isReporting, toggleReporting } = useReportingContext();
  const { competition, getTodayBonus } = useCompetitionContext();
  const todayBonus = getTodayBonus();

  if (!competition.has_started) {
    return (
      <section className="mb-10 max-w-2xl mx-auto animate-slide-up">
        <Card
          variant={CARD_VARIANT.DARK}
          className="text-center p-4 border-dashed border-gold/10 max-w-md mx-auto"
        >
          <Text
            variant={TEXT_VARIANT.H2}
            className="text-gold/30 italic font-medium"
          >
            {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.NOT_STARTED_TITLE}
          </Text>
          <div className="mt-2 opacity-60">
            <Text variant={TEXT_VARIANT.BODY} className="mt-2 opacity-60">
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
          variant={CARD_VARIANT.DARK}
          className="border-game-bonus-bright/30 bg-game-bonus/20 p-4 flex items-center gap-4 animate-pulse"
        >
          <div className="flex-1 flex items-center gap-4">
            <Badge variant={BADGE_VARIANT.BONUS} className="text-xl">
              x{todayBonus.multiplier}
            </Badge>
            <div>
              <Text
                variant={TEXT_VARIANT.CAPTION}
                className="text-game-bonus-bright font-bold uppercase tracking-wider"
              >
                {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.BONUS_DAY}
              </Text>
              <Text as="p" variant={TEXT_VARIANT.MICRO} className="opacity-70">
                {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.BONUS_HINT}
              </Text>
            </div>
          </div>
          <Badge variant={BADGE_VARIANT.BONUS} className="text-xl">
            x{todayBonus.multiplier}
          </Badge>
        </Card>
      )}

      {!isReporting ? (
        <Button
          variant={BUTTON_VARIANT.DANGER}
          fullWidth
          size={BUTTON_SIZE.LARGE}
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
