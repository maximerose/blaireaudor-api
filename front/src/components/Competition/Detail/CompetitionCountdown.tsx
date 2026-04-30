import { Text } from '@/components/UI';
import { useCompetitionCountdown } from '@/hooks';
import { cn } from '@/utils';

interface CompetitionCountdownProps {
  targetDate: string;
  prefix?: string;
  onElapsed?: () => void;
  elapsedText?: string;
}

export const CompetitionCountdown = ({ targetDate, prefix, onElapsed, elapsedText }: CompetitionCountdownProps) => {
  const { timeLeft, formatTime, isUrgent } = useCompetitionCountdown(targetDate, onElapsed);

  if (!timeLeft) return null;

  if (timeLeft.isElapsed) {
    return <Text variant="mono">{elapsedText || 'Terminée'}</Text>;
  }

  return (
    <Text variant="mono">
      {prefix && <span className="mr-1 opacity-60">{prefix} </span>}

      <span className={cn(
        "tracking-widest",
        isUrgent ? "text-danger" : "text-gold"
      )}>
        {timeLeft.days > 0 ? (
          timeLeft.days === 1 ? 'demain' : `dans ${timeLeft.days} jours`
        ) : (
          `${formatTime(timeLeft.hours)}:${formatTime(timeLeft.minutes)}:${formatTime(timeLeft.seconds)}`
        )}
      </span>
    </Text>
  );
};