// front/src/features/stats/components/CareerPalmares.tsx

import { RankBadge, RankedScore } from '@/features/competition/leaderboard';
import { PLAYER_STATS_PALMARES } from '@/features/stats/constants';
import { useCareerPalmares } from '@/features/stats/hooks';
import {
  Badge,
  Card,
  CARD_VARIANT,
  EmptyState,
  Grid,
  ICONS,
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';

export const CareerPalmares = () => {
  const { palmares } = useCareerPalmares();

  return (
    <Stack gap="sm" className="w-full animate-fade-in mt-4">
      {/* 🟢 Correction En-tête : Changement de la variante pour autoriser le retour à la ligne naturel sur mobile */}
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={SECTION_HEADER_THEME.GOLD}
        icon={ICONS.TROPHY}
        title={PLAYER_STATS_PALMARES.TITLE}
        className="px-1 text-left"
      />

      {palmares.length === 0 ? (
        <EmptyState
          icon={ICONS.EMPTY}
          title={PLAYER_STATS_PALMARES.EMPTY}
          layout="card"
        />
      ) : (
        <Card
          variant={CARD_VARIANT.DARK}
          padding="none"
          className="w-full border-border-subtle shadow-2xl overflow-hidden"
        >
          {/* 🟢 Correction Tableau : Masquage des en-têtes de colonnes sur mobile car le nouveau layout condensé est auto-explicatif */}
          <Grid
            cols={12}
            gap="sm"
            className="hidden sm:grid bg-white/5 px-4 py-2 border-b border-b-border-subtle text-xs uppercase"
          >
            <div className="col-span-8 text-left">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="font-black tracking-widest"
              >
                {PLAYER_STATS_PALMARES.TH_COMPETITION}
              </Text>
            </div>
            <div className="col-span-4 text-right">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="font-black tracking-widest"
              >
                {PLAYER_STATS_PALMARES.TH_SCORE}
              </Text>
            </div>
          </Grid>

          {/* LIGNES DU CLASSEMENT */}
          <div className="divide-y divide-white/5" role="list">
            {palmares.map((p) => {
              const isTop3 = p.rank <= 3;

              return (
                <Grid
                  key={p.id}
                  cols={12}
                  gap="sm"
                  align="center"
                  className="p-4 hover:bg-surface-base/20 transition-default w-full"
                >
                  {/* 🏷️ Gauche : Détails de la compétition (col-span boosté de 6 à 8) */}
                  <Stack gap="none" className="col-span-8 text-left min-w-0">
                    <Text
                      variant={TEXT_VARIANT.H3}
                      className="text-sm text-silver font-bold normal-case leading-snug wrap-break-word"
                    >
                      {p.competition.name}
                    </Text>
                    <Text
                      variant={TEXT_VARIANT.MICRO}
                      colorTheme={TEXT_THEME.GOLD}
                      className="text-xs font-mono mt-1 tracking-wider block"
                    >
                      {p.competition.join_code}
                    </Text>
                  </Stack>

                  {/* 📊 Droite : Case fusionnée (Score en haut, Rang en bas) (col-span-4) */}
                  <Stack
                    gap="xs"
                    align="end"
                    justify="center"
                    className="col-span-4 text-right shrink-0"
                  >
                    {/* Le score de l'arène */}
                    <RankedScore
                      score={p.score}
                      rank={p.rank}
                      className="justify-end"
                    />

                    {/* Le badge ou rang obtenu juste en-dessous */}
                    <div className="flex items-center justify-end h-6 mt-0.5">
                      {isTop3 ? (
                        <RankBadge
                          rank={p.rank}
                          className="scale-90 origin-right"
                        />
                      ) : (
                        <Badge
                          variant="ghost"
                          className="font-mono text-[10px] font-bold px-2 py-0.5 opacity-60"
                        >
                          {PLAYER_STATS_PALMARES.RANK(p.rank)}
                        </Badge>
                      )}
                    </div>
                  </Stack>
                </Grid>
              );
            })}
          </div>
        </Card>
      )}
    </Stack>
  );
};
