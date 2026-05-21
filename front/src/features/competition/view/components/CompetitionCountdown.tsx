import { Text, TEXT_VARIANT, cn } from '@/shared';
import { useCompetitionCountdown } from '@/features/competition/view/hooks';
import { COMPETITION_UI } from '../../constants';

interface CompetitionCountdownProps {
  targetDate: string;
  prefix?: string;
  onElapsed?: () => void;
  elapsedText?: string;
}

export const CompetitionCountdown = ({
  targetDate,
  prefix,
  onElapsed,
  elapsedText,
}: CompetitionCountdownProps) => {
  const { timeLeft, formatTime, isUrgent } = useCompetitionCountdown(
    targetDate,
    onElapsed,
  );

  if (!timeLeft) return null;

  if (timeLeft.isElapsed) {
    return (
      <Text variant={TEXT_VARIANT.MONO}>
        {elapsedText || COMPETITION_UI.DETAIL.COUNTDOWN.ELAPSED}
      </Text>
    );
  }

  return (
    <Text variant={TEXT_VARIANT.MONO}>
      {prefix && <span className="mr-1 opacity-60">{prefix} </span>}

      <span
        className={cn(
          'tracking-widest',
          isUrgent ? 'text-danger' : 'text-gold',
        )}
      >
        {timeLeft.days > 0
          ? timeLeft.days === 1
            ? COMPETITION_UI.DETAIL.COUNTDOWN.TOMORROW
            : COMPETITION_UI.DETAIL.COUNTDOWN.IN_DAYS(timeLeft.days)
          : `${formatTime(timeLeft.hours)}:${formatTime(timeLeft.minutes)}:${formatTime(timeLeft.seconds)}`}
      </span>
    </Text>
  );
};
