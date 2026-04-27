import { Text } from '@/components/UI';
import type { Competition } from '@/context/AuthContext';
import { getDisplayDateText, getTimeRemaining } from '@/utils';

export const CompetitionHeader = ({
  competition,
}: {
  competition: Competition;
}) => {
  const timeRemaining = getTimeRemaining(competition);
  return (
    <header className="mb-10 text-center space-y-2">
      <Text variant="h1" className="text-3xl sm:text-5xl">
        {competition.name}
      </Text>
      <div className="flex flex-col items-center gap-1">
        <Text
          variant="mono"
          className="text-gold/50 tracking-[0.4em] uppercase text-sm"
        >
          <span className="sr-only">Code d'accès : </span>
          CODE : {competition.join_code}
        </Text>

        <Text variant="caption" className="opacity-60">
          <span className="sr-only">Dates : </span>
          {getDisplayDateText(competition.start_date, competition.end_date)}
        </Text>

        {competition.has_started && timeRemaining && (
          <div className="mt-1" aria-live="polite">
            <span className="text-sm font-black uppercase tracking-widest text-white/30 italic">
              Termine{' '}
            </span>
            <span
              className={`text-sm font-black uppercase tracking-widest ${
                competition.is_urgent
                  ? 'text-danger animate-pulse'
                  : 'text-gold'
              }`}
            >
              {timeRemaining}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
