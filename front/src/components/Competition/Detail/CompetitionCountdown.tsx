import { useCompetitionCountdown } from '@/hooks';

interface CompetitionCountdownProps {
  startDate: string;
  onStart?: () => void;
}

export const CompetitionCountdown = ({ startDate, onStart }: CompetitionCountdownProps) => {
  const { timeLeft, formatTime } = useCompetitionCountdown(startDate, onStart);

  if (!timeLeft) return null;

  if (timeLeft.isStarted) {
    return <span className="text-gold font-bold">ouverte ! (rafraîchissez la page)</span>;
  }

  if (timeLeft.days > 0) {
    return (
      <span className="text-gold font-bold">
        {timeLeft.days === 1 ? 'demain' : `dans ${timeLeft.days} jours`}
      </span>
    );
  }

  return (
    <span className="text-gold font-bold font-mono tracking-widest text-lg ml-1">
      {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
    </span>
  );
};