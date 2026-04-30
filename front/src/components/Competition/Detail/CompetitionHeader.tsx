import { Badge, Text } from '@/components/UI';
import type { Competition } from '@/context/AuthContext';
import { cn, getCompetitionReferees, getDisplayDateText } from '@/utils';
import { CompetitionCountdown } from './CompetitionCountdown';

interface CompetitionHeaderProps {
  competition: Competition;
  creatorName: string | null;
}

export const CompetitionHeader = ({
  competition,
  creatorName,
}: CompetitionHeaderProps) => {
  const referees = getCompetitionReferees(competition);

  return (
    <header className="mb-10 text-center space-y-5">
      {/* 1. Titre et Code */}
      <div className="space-y-1">
        <Text variant="h1" className="text-3xl sm:text-5xl">
          {competition.name}
        </Text>
        <Text
          variant="mono"
          className="text-gold/50 tracking-[0.4em] uppercase text-sm inline-block bg-gold/5 px-3 py-1 rounded border border-gold/10"
        >
          <span className="sr-only">Code d'accès : </span>
          {competition.join_code}
        </Text>
      </div>

      {/* 2. Infos Temporelles */}
      <div className="flex flex-col items-center gap-1">
        <Text variant="caption" className="opacity-60">
          <span className="sr-only">Dates : </span>
          {getDisplayDateText(competition.start_date, competition.end_date)}
        </Text>

        {competition.has_started && !competition.is_finished && (
          <div className="mt-1 bg-black/20 px-3 py-1 rounded-full border border-white/5" aria-live="polite">
            <CompetitionCountdown
              prefix="Clôture"
              targetDate={competition.end_date}
            />
          </div>
        )}
      </div>

      {/* 3. Méta-informations groupées */}
      {(creatorName || referees.length > 0) && (
        <div className="pt-4 border-t border-white/5 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3">

          {/* Section Créateur : Toujours affichée si présente */}
          {creatorName && (
            <div className="flex items-center gap-2">
              <Text variant="micro" className="opacity-40 uppercase tracking-widest">
                Créateur
              </Text>
              <Text variant="caption" className="text-gold font-medium">
                {creatorName}
              </Text>
            </div>
          )}

          {/* Séparateur visuel si on a les deux infos */}
          {creatorName && referees.length > 0 && (
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
          )}

          {/* Section Arbitres : Liste complète des arbitres */}
          {referees.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Text variant="micro" className="opacity-40 uppercase tracking-widest sm:mr-1">
                Arbitre{referees.length > 1 ? 's' : ''}
              </Text>
              {referees.map((ref: any) => (
                <Badge
                  key={ref.id}
                  variant="info"
                  icon="⚖️"
                  className={cn(
                    "py-0.5",
                    ref.name === creatorName && "border-gold/60"
                  )}
                >
                  {ref.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};