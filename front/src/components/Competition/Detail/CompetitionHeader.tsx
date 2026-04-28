import { Badge, Text } from '@/components/UI';
import type { Competition } from '@/context/AuthContext';
import { getCompetitionReferees, getDisplayDateText, getTimeRemaining } from '@/utils';

interface CompetitionHeaderProps {
  competition: Competition;
  creatorName: string | null;
}

export const CompetitionHeader = ({
  competition,
  creatorName,
}: CompetitionHeaderProps) => {
  const timeRemaining = getTimeRemaining(competition);
  const referees = getCompetitionReferees(competition);

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
              className={`text-sm font-black uppercase tracking-widest ${competition.is_urgent
                ? 'text-danger animate-pulse'
                : 'text-gold'
                }`}
            >
              {timeRemaining}
            </span>
          </div>
        )}
      </div>

      {creatorName && (
        <div className="border-t border-white/5 max-w-lg mx-auto space-y-3 pt-4 mt-6">
          <Text variant="caption" className="opacity-40 uppercase tracking-widest text-[10px]">
            Créé par <span className="text-gold">{creatorName}</span>
          </Text>
        </div>
      )}

      {referees.length > 0 && (
        <div className="border-t border-white/5 max-w-lg mx-auto space-y-3 pt-4 mt-6">
          <Text variant="caption" className="opacity-40 uppercase tracking-widest text-[10px]">
            Arbitres
          </Text>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {referees.map((ref: any) => (
              <Badge key={ref.id} variant="info" icon="⚖️">
                {ref.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
