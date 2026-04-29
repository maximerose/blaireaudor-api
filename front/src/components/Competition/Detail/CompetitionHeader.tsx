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

  const additionalReferees = referees.filter(
    (ref: any) => ref.name !== creatorName
  );

  return (
    <header className="mb-10 text-center space-y-5">
      {/* 1. Titre et Code (La priorité absolue) */}
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

        {competition.has_started && timeRemaining && (
          <div className="mt-1 bg-black/20 px-3 py-1 rounded-full border border-white/5" aria-live="polite">
            <span className="text-xs font-black uppercase tracking-widest text-white/30 italic mr-2">
              Termine
            </span>
            <span
              className={`text-xs font-black uppercase tracking-widest ${competition.is_urgent ? 'text-danger animate-pulse' : 'text-gold'
                }`}
            >
              {timeRemaining}
            </span>
          </div>
        )}
      </div>

      {/* 3. Méta-informations groupées (Créateur & Arbitres) */}
      {(creatorName || referees.length > 0) && (
        <div className="pt-4 border-t border-white/5 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3">

          {/* Créateur */}
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

          {/* Séparateur visible uniquement sur desktop */}
          {creatorName && additionalReferees.length > 0 && (
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
          )}

          {/* Arbitres (sans répéter le créateur si c'est la même personne) */}
          {referees.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {additionalReferees.length > 0 ? (
                <>
                  <Text variant="micro" className="opacity-40 uppercase tracking-widest sm:mr-1">
                    Arbitre{additionalReferees.length > 1 ? 's' : ''}
                  </Text>
                  {additionalReferees.map((ref: any) => (
                    <Badge key={ref.id} variant="info" icon="⚖️" className="py-0.5">
                      {ref.name}
                    </Badge>
                  ))}
                </>
              ) : (
                /* Si le seul arbitre est le créateur, on met juste un petit badge discret à côté de son nom */
                <Badge variant="ghost" icon="⚖️" className="opacity-50 scale-90" title="Arbitre également">
                  Arbitre
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
