import { Badge, Text } from '@/components/UI';
import {
  formatLongDate,
  getCompetitionReferees,
  getDisplayDateText,
  resolveCreatorName,
} from '@/utils';
import { CompetitionCountdown } from './CompetitionCountdown';
import { useAuth, useCompetition, usePermissions } from '@/hooks';
import type { BonusDay, RefereeListItem } from '@/types';
import { COMPETITION_UI, ICONS, UI } from '@/constants';
import { useMemo } from 'react';

export const CompetitionHeader = () => {
  const { user } = useAuth();
  const { competition, leaderboard, bonusDays } = useCompetition();
  const { roles } = usePermissions();

  const referees = getCompetitionReferees(competition);

  const creatorName = useMemo(
    () => resolveCreatorName(competition, leaderboard, user),
    [competition, leaderboard, user],
  );

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
          <span className="sr-only">
            {COMPETITION_UI.DETAIL.SECTIONS.HEADER.JOIN_CODE_ARIA}
          </span>
          {competition.join_code}
        </Text>
      </div>

      {/* 2. Infos Temporelles */}
      <div className="flex flex-col items-center gap-1">
        <Text variant="caption" className="opacity-60">
          <span className="sr-only">
            {COMPETITION_UI.DETAIL.SECTIONS.HEADER.DATES_ARIA}
          </span>
          {getDisplayDateText(competition.start_date, competition.end_date)}
        </Text>

        {competition.has_started &&
          !competition.is_finished &&
          competition.end_date && (
            <div
              className="mt-1 bg-black/20 px-3 py-1 rounded-full border border-white/5"
              aria-live="polite"
            >
              <CompetitionCountdown
                prefix={COMPETITION_UI.DETAIL.SECTIONS.HEADER.COUNTDOWN_PREFIX}
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
              <Text
                variant="micro"
                className="opacity-40 uppercase tracking-widest"
              >
                {COMPETITION_UI.DETAIL.SECTIONS.HEADER.CREATOR_LABEL}
              </Text>
              <Text
                variant="caption"
                className="font-medium text-success-bright"
              >
                {creatorName}
                {roles.isCreator && (
                  <span className="text-[9px] opacity-60 ml-1 uppercase">
                    ({UI.ME})
                  </span>
                )}
              </Text>
            </div>
          )}

          {/* Séparateur visuel si on a les deux infos */}
          {creatorName && referees.length > 0 && (
            <span
              className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/20"
              aria-hidden="true"
            />
          )}

          {/* Section Arbitres : Liste complète des arbitres */}
          {referees.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Text
                variant="micro"
                className="opacity-40 uppercase tracking-widest sm:mr-1"
              >
                {COMPETITION_UI.DETAIL.SECTIONS.HEADER.REFEREE_LABEL(
                  referees.length,
                )}
              </Text>
              {referees.map((ref: RefereeListItem) => {
                const isMe = user?.player?.id === ref.id;
                const isCreator = ref.userId === competition.created_by.id;

                return (
                  <Badge
                    key={ref.id}
                    variant={isCreator ? 'success' : isMe ? 'gold' : 'info'}
                    icon={isCreator ? ICONS.CREATOR : ICONS.REFEREE}
                  >
                    {ref.name}
                    {isMe && <span className="opacity-60">({UI.ME})</span>}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      )}

      {bonusDays.length > 0 && (
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          <Text
            variant="micro"
            className="opacity-40 uppercase tracking-widest w-full mb-1"
          >
            {COMPETITION_UI.DETAIL.SECTIONS.HEADER.MULTIPLIERS_SECTION_TITLE}
          </Text>
          {bonusDays.map((bd: BonusDay) => (
            <div
              key={bd.id}
              className="flex items-center rounded-md overflow-hidden border border-game-bonus/30 bg-game-bonus/20"
            >
              <span className="px-2 py-1 text-[10px] font-mono text-silver bg-black/40 uppercase">
                {formatLongDate(bd.date)}
              </span>
              <span className="px-2 py-1 text-xs font-black text-game-bonus-bright">
                x{bd.multiplier}
              </span>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};
