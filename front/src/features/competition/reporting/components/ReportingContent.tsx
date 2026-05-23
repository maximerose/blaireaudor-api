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
  TEXT_THEME,
  Stack,
  Row,
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
      <Stack
        as="section"
        mb="lg"
        align="center"
        className="max-w-2xl mx-auto animate-slide-up"
      >
        <Card
          variant={CARD_VARIANT.GLASS}
          className="border-dashed border-gold-border w-full max-w-md"
        >
          <Card.Body p="md">
            <Stack gap="sm" align="center">
              <Text
                variant={TEXT_VARIANT.H2}
                colorTheme={TEXT_THEME.GOLD}
                className="italic font-medium text-center opacity-30"
              >
                {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.NOT_STARTED_TITLE}
              </Text>

              <Stack gap="sm" align="center" className="w-full opacity-60">
                <Text variant={TEXT_VARIANT.BODY} className="text-center">
                  {
                    COMPETITION_UI.DETAIL.SECTIONS.REPORTING
                      .NOT_STARTED_SUBTITLE
                  }
                </Text>
                <CompetitionCountdown
                  targetDate={competition.start_date}
                  elapsedText={
                    COMPETITION_UI.DETAIL.SECTIONS.REPORTING.NOT_STARTED_ELAPSED
                  }
                />
              </Stack>
            </Stack>
          </Card.Body>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack
      as="section"
      gap="md"
      mb="sm"
      className="max-w-2xl mx-auto animate-slide-up"
    >
      {todayBonus && (
        <Card
          variant={CARD_VARIANT.DARK}
          className="border-bonus-border bg-bonus-soft animate-pulse"
        >
          <Card.Body p="md">
            <Row justify="between" align="center" className="w-full">
              <Row align="center" gap="md" className="min-w-0">
                <Badge variant={BADGE_VARIANT.BONUS} className="text-xl">
                  x{todayBonus.multiplier}
                </Badge>
                <Stack gap="none" className="min-w-0">
                  <Text
                    variant={TEXT_VARIANT.CAPTION}
                    className="text-game-bonus-bright font-bold uppercase tracking-wider"
                  >
                    {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.BONUS_DAY}
                  </Text>
                  <Text
                    as="p"
                    variant={TEXT_VARIANT.MICRO}
                    colorTheme={TEXT_THEME.MUTED}
                  >
                    {COMPETITION_UI.DETAIL.SECTIONS.REPORTING.BONUS_HINT}
                  </Text>
                </Stack>
              </Row>

              <Badge variant={BADGE_VARIANT.BONUS} className="text-xl shrink-0">
                x{todayBonus.multiplier}
              </Badge>
            </Row>
          </Card.Body>
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
    </Stack>
  );
};
