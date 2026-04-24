import { Text } from '@/components/UI';
import { getDisplayDateText } from '@/utils';

interface CompetitionHeaderProps {
  name: string;
  joinCode: string;
  startDate: string;
  endDate: string;
  hasStarted: boolean;
  timeRemaining: string | null;
  isUrgent: boolean;
}

export const CompetitionHeader = ({
  name,
  joinCode,
  startDate,
  endDate,
  hasStarted,
  timeRemaining,
  isUrgent,
}: CompetitionHeaderProps) => (
  <header className="mb-10 text-center space-y-2">
    <Text variant="h1" className="text-3xl sm:text-5xl">
      {name}
    </Text>
    <div className="flex flex-col items-center gap-1">
      <Text
        variant="mono"
        className="text-gold/50 tracking-[0.4em] uppercase text-sm"
      >
        <span className="sr-only">Code d'accès : </span>
        CODE : {joinCode}
      </Text>

      <Text variant="caption" className="opacity-60">
        <span className="sr-only">Dates : </span>
        {getDisplayDateText(startDate, endDate)}
      </Text>

      {hasStarted && timeRemaining && (
        <div className="mt-1" aria-live="polite">
          <span className="text-sm font-black uppercase tracking-widest text-white/30 italic">
            Termine{' '}
          </span>
          <span
            className={`text-sm font-black uppercase tracking-widest ${
              isUrgent ? 'text-danger animate-pulse' : 'text-gold'
            }`}
          >
            {timeRemaining}
          </span>
        </div>
      )}
    </div>
  </header>
);
