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
  ROUTES, // 🟢 Ajout de ROUTES
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';
import { Link } from 'react-router-dom'; // 🟢 Ajout de l'import

export const CareerPalmares = () => {
  const { palmares } = useCareerPalmares();

  return (
    <Stack gap="sm" className="w-full animate-fade-in mt-4">
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

          <div className="divide-y divide-white/5" role="list">
            {palmares.map((p) => {
              const isTop3 = p.rank <= 3;

              return (
                <Grid
                  key={p.id}
                  as={Link}
                  to={ROUTES.NAV.COMPETITION_DETAIL(p.competition.join_code)}
                  cols={12}
                  gap="sm"
                  align="center"
                  className="p-4 hover:bg-surface-base focus:bg-surface-base focus:outline-none transition-default w-full cursor-pointer group"
                >
                  <Stack gap="none" className="col-span-8 text-left min-w-0">
                    <Text
                      variant={TEXT_VARIANT.H3}
                      className="text-sm text-silver font-bold normal-case leading-snug wrap-break-word group-hover:text-gold transition-colors"
                    >
                      {p.competition.name}
                    </Text>
                    <Text
                      variant={TEXT_VARIANT.MICRO}
                      colorTheme={TEXT_THEME.GOLD}
                      className="text-xs font-mono mt-1 tracking-wider block opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                      {p.competition.join_code}
                    </Text>
                  </Stack>

                  <Stack
                    gap="xs"
                    align="end"
                    justify="center"
                    className="col-span-4 text-right shrink-0"
                  >
                    <RankedScore
                      score={p.score}
                      rank={p.rank}
                      className="justify-end"
                    />

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
