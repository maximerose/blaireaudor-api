import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Stack,
  Grid,
  Badge,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  SECTION_HEADER_THEME,
  cn,
  ICONS,
  EmptyState,
} from '@/shared';
import { RankBadge, RankedScore } from '@/features/competition/leaderboard';
import { useCareerPalmares } from '@/features/stats/hooks';
import { PLAYER_STATS_PALMARES } from '@/features/stats/constants';

export const CareerPalmares = () => {
  const { palmares } = useCareerPalmares();

  return (
    <Stack gap="sm" className="w-full animate-fade-in mt-2">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={SECTION_HEADER_THEME.GOLD}
        icon={ICONS.TROPHY}
        title={PLAYER_STATS_PALMARES.TITLE}
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
            className="bg-white/5 px-4 py-2 border-b border-b-border-subtle"
          >
            <div className="col-span-6 text-left">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="font-black tracking-widest"
              >
                {PLAYER_STATS_PALMARES.TH_COMPETITION}
              </Text>
            </div>
            <div className="col-span-3 flex justify-center">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="font-black tracking-widest"
              >
                {PLAYER_STATS_PALMARES.TH_RANK}
              </Text>
            </div>
            <div className="col-span-3 flex justify-end">
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
                  cols={12}
                  gap="sm"
                  align="center"
                  className="p-4 hover:bg-surface-base/20 transition-default"
                >
                  <Stack gap="none" className="col-span-6 text-left min-w-0">
                    <Text
                      variant={TEXT_VARIANT.H3}
                      className="truncate text-sm text-silver font-bold normal-case"
                    >
                      {p.competition.name}
                    </Text>
                    <Text
                      variant={TEXT_VARIANT.MICRO}
                      colorTheme={TEXT_THEME.GOLD}
                      className="text-[8px] font-mono mt-0.5 tracking-wider"
                    >
                      {p.competition.join_code}
                    </Text>
                  </Stack>

                  <div
                    className={cn(
                      'col-span-3 flex items-center justify-center',
                    )}
                  >
                    {isTop3 ? (
                      <RankBadge rank={p.rank} />
                    ) : (
                      <Badge
                        variant="ghost"
                        className="font-mono text-xs font-bold px-2.5 py-0.5"
                      >
                        {PLAYER_STATS_PALMARES.RANK(p.rank)}
                      </Badge>
                    )}
                  </div>

                  <div className="col-span-3 flex justify-end">
                    <RankedScore
                      score={p.score}
                      rank={p.rank}
                      className="text-right"
                    />
                  </div>
                </Grid>
              );
            })}
          </div>
        </Card>
      )}
    </Stack>
  );
};
