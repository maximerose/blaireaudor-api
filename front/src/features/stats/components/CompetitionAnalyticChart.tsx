import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Card,
  CARD_VARIANT,
  Row,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  formatShortDate,
  cn,
  Stack,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  SECTION_HEADER_THEME,
  ICONS,
} from '@/shared';
import {
  COMPETITION_STATS_GENERAL,
  CHART_COLORS,
  CHART_ME_COLOR,
} from '@/features/stats/constants';
import type { AnalyticChartProps } from '@/features/stats/types';
import { CompetitionChartTooltip } from './CompetitionChartTooltip';
import { CompetitionChartLegend } from './CompetitionChartLegend';
import { useAnalyticChartUI } from '@/features/stats/hooks';

export const CompetitionAnalyticChart = ({
  bumpData,
  dailyEvolution,
  leaderboard,
  myPlayerId,
  hiddenLines,
  onLegendClick,
  activeFilter,
  onFilterChange,
  isFullscreen,
  onOpenFullscreen,
  onCloseFullscreen,
}: AnalyticChartProps) => {
  const { chartMode, setChartMode, isDense } = useAnalyticChartUI(bumpData);

  const renderRanksChart = (heightClass: string) => (
    <div className={cn('w-full animate-fade-in', heightClass)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={bumpData}
          margin={{ top: 50, right: 35, left: -15, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(val) => formatShortDate(val)}
            stroke="rgba(255,255,255,0.2)"
            tick={{ fontSize: 10 }}
            dy={10}
            minTickGap={30}
            interval="preserveStartEnd"
          />
          <YAxis
            reversed
            stroke="rgba(255,255,255,0.2)"
            tick={{ fontSize: 10 }}
            domain={[1, 'dataMax']}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CompetitionChartTooltip
                active={active}
                payload={payload}
                label={label}
                isPointsMode={false}
              />
            )}
            cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 2 }}
          />
          <Legend content={() => null} />

          {leaderboard.map((item, index) => {
            const isHidden = hiddenLines[item.player.id];
            const isMe = item.player.id === myPlayerId;

            return (
              <Line
                key={item.player.id}
                type="bump"
                dataKey={item.player.id}
                name={item.player.display_name}
                stroke={
                  isMe
                    ? CHART_ME_COLOR
                    : CHART_COLORS[index % CHART_COLORS.length]
                }
                strokeWidth={isMe ? (isDense ? 3 : 5) : isDense ? 1.5 : 2}
                dot={
                  isDense
                    ? false
                    : { r: isMe ? 5 : 4, strokeWidth: 2, fill: '#121212' }
                }
                activeDot={{ r: 7, stroke: '#fff' }}
                hide={isHidden}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPointsChart = (heightClass: string) => (
    <div className={cn('w-full animate-fade-in', heightClass)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dailyEvolution}
          margin={{ top: 20, right: 35, left: -15, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            stroke="rgba(255,255,255,0.2)"
            tick={{ fontSize: 10 }}
            dy={10}
            minTickGap={30}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="rgba(255,255,255,0.2)"
            tick={{ fontSize: 10 }}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CompetitionChartTooltip
                active={active}
                payload={payload}
                label={label}
                isPointsMode={true}
              />
            )}
            cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 2 }}
          />
          <Legend content={() => null} />
          {leaderboard.map((item, index) => {
            const isHidden = hiddenLines[item.player.id];
            const isMe = item.player.id === myPlayerId;
            return (
              <Line
                key={item.player.id}
                type="monotone"
                dataKey={item.player.id}
                name={item.player.display_name}
                stroke={
                  isMe ? '#d4af37' : CHART_COLORS[index % CHART_COLORS.length]
                }
                strokeWidth={isMe ? (isDense ? 3 : 5) : isDense ? 1.5 : 2}
                dot={
                  isDense
                    ? false
                    : { r: isMe ? 5 : 4, strokeWidth: 2, fill: '#121212' }
                }
                activeDot={{ r: 7, stroke: '#fff' }}
                hide={isHidden}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderActiveChart = (heightClass: string) =>
    chartMode === 'ranks'
      ? renderRanksChart(heightClass)
      : renderPointsChart(heightClass);

  return (
    <Stack gap="sm" className="w-full mt-4">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={SECTION_HEADER_THEME.GOLD}
        title={COMPETITION_STATS_GENERAL.CHART.TITLE}
      />

      <Row
        justify="center"
        gap="sm"
        wrap
        className="bg-surface-base p-1 rounded-xl border border-border-subtle w-fit mx-auto"
      >
        {myPlayerId && (
          <Button
            variant={
              activeFilter === 'me'
                ? BUTTON_VARIANT.PRIMARY
                : BUTTON_VARIANT.GHOST
            }
            size={BUTTON_SIZE.SMALL}
            onClick={() => onFilterChange('me')}
            className="rounded-lg"
          >
            {COMPETITION_STATS_GENERAL.FILTERS.ME}
          </Button>
        )}
        {leaderboard.length >= 3 && (
          <Button
            variant={
              activeFilter === 'top3'
                ? BUTTON_VARIANT.PRIMARY
                : BUTTON_VARIANT.GHOST
            }
            size={BUTTON_SIZE.SMALL}
            onClick={() => onFilterChange('top3')}
            className="rounded-lg"
          >
            {COMPETITION_STATS_GENERAL.FILTERS.TOP3}
          </Button>
        )}
        {leaderboard.length >= 5 && (
          <Button
            variant={
              activeFilter === 'top5'
                ? BUTTON_VARIANT.PRIMARY
                : BUTTON_VARIANT.GHOST
            }
            size={BUTTON_SIZE.SMALL}
            onClick={() => onFilterChange('top5')}
            className="rounded-lg"
          >
            {COMPETITION_STATS_GENERAL.FILTERS.TOP5}
          </Button>
        )}
        {leaderboard.length >= 10 && (
          <Button
            variant={
              activeFilter === 'top10'
                ? BUTTON_VARIANT.PRIMARY
                : BUTTON_VARIANT.GHOST
            }
            size={BUTTON_SIZE.SMALL}
            onClick={() => onFilterChange('top10')}
            className="rounded-lg hidden sm:flex"
          >
            {COMPETITION_STATS_GENERAL.FILTERS.TOP10}
          </Button>
        )}
        <Button
          variant={
            activeFilter === 'all'
              ? BUTTON_VARIANT.PRIMARY
              : BUTTON_VARIANT.GHOST
          }
          size={BUTTON_SIZE.SMALL}
          onClick={() => onFilterChange('all')}
          className="rounded-lg"
        >
          {COMPETITION_STATS_GENERAL.FILTERS.ALL(leaderboard.length)}
        </Button>
      </Row>

      <Card
        variant={CARD_VARIANT.DARK}
        className="w-full border-border-subtle p-2 sm:p-4 mt-2 relative overflow-visible"
      >
        <div className="absolute top-2 left-2 z-10 w-fit bg-dark-lighter p-1 rounded-lg border border-border-subtle flex gap-1 shadow-lg">
          <button
            type="button"
            onClick={() => setChartMode('ranks')}
            className={cn(
              'px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-default',
              chartMode === 'ranks'
                ? 'bg-gold text-dark'
                : 'text-silver hover:bg-white/5',
            )}
          >
            {COMPETITION_STATS_GENERAL.CHART.TOGGLE_RANKS}
          </button>
          <button
            type="button"
            onClick={() => setChartMode('points')}
            className={cn(
              'px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-default',
              chartMode === 'points'
                ? 'bg-gold text-dark'
                : 'text-silver hover:bg-white/5',
            )}
          >
            {COMPETITION_STATS_GENERAL.CHART.TOGGLE_POINTS}
          </button>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant={BUTTON_VARIANT.SECONDARY}
            size={BUTTON_SIZE.SMALL}
            onClick={onOpenFullscreen}
          >
            <span className="sm:hidden">{ICONS.MAXIMIZE}</span>
            <span className="hidden sm:block">
              {COMPETITION_STATS_GENERAL.CHART.BTN_MAXIMIZE}
            </span>
          </Button>
        </div>

        <div className="pt-10 sm:pt-0">{renderActiveChart('h-96')}</div>

        <CompetitionChartLegend
          leaderboard={leaderboard}
          hiddenLines={hiddenLines}
          myPlayerId={myPlayerId}
          onLegendClick={onLegendClick}
        />

        <Text
          variant={TEXT_VARIANT.MICRO}
          colorTheme={TEXT_THEME.DIMMED}
          className="text-center w-full block mt-4 px-2"
        >
          {COMPETITION_STATS_GENERAL.CHART.HELP_HINT}
        </Text>
      </Card>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-dark flex flex-col animate-fade-in pb-4">
          <Row
            justify="between"
            align="center"
            p="md"
            className="border-b border-border-subtle bg-dark-lighter shrink-0"
          >
            <Text variant={TEXT_VARIANT.MICRO} colorTheme={TEXT_THEME.SUCCESS}>
              {COMPETITION_STATS_GENERAL.CHART.FULLSCREEN_HELP}
            </Text>
            <Button
              variant={BUTTON_VARIANT.DANGER}
              size={BUTTON_SIZE.SMALL}
              onClick={onCloseFullscreen}
            >
              {COMPETITION_STATS_GENERAL.CHART.BTN_CLOSE}
            </Button>
          </Row>
          <div className="p-2 sm:p-6 flex-1 min-h-0 w-full overflow-y-auto flex flex-col">
            {renderActiveChart('flex-1 min-h-96')}
            <CompetitionChartLegend
              leaderboard={leaderboard}
              hiddenLines={hiddenLines}
              myPlayerId={myPlayerId}
              onLegendClick={onLegendClick}
            />
          </div>
        </div>
      )}
    </Stack>
  );
};
