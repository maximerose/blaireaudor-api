import {
  CHART_COLORS,
  CHART_ME_COLOR,
  COMPETITION_STATS_GENERAL,
} from '@/features/stats/constants';
import { useAnalyticChartUI } from '@/features/stats/hooks';
import type { AnalyticChartProps } from '@/features/stats/types';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Card,
  CARD_VARIANT,
  cn,
  formatShortDate,
  ICONS,
  Row,
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CompetitionChartLegend } from './CompetitionChartLegend';
import { CompetitionChartTooltip } from './CompetitionChartTooltip';

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
    <div
      className={cn('w-full animate-fade-in min-w-0', heightClass)}
      style={{ minWidth: 0, minHeight: 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={bumpData}
          margin={{ top: 30, right: 35, left: -15, bottom: 0 }}
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
    <div
      className={cn('w-full animate-fade-in min-w-0', heightClass)}
      style={{ minWidth: 0, minHeight: 0 }}
    >
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

      {/* 🏷️ 1. ZONE DES FILTRES DE POPULATION (TOP 3, TOP 5...) */}
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

      {/* 🔄 2. NOUVELLE ZONE DU SÉLECTEUR DE MODE (Extraite du graphique !) */}
      <div className="bg-surface-base p-1 rounded-xl border border-border-subtle flex gap-1 w-fit mx-auto mt-1 animate-fade-in">
        <button
          type="button"
          onClick={() => setChartMode('ranks')}
          className={cn(
            'px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-default cursor-pointer',
            chartMode === 'ranks'
              ? 'bg-gold text-dark font-black'
              : 'text-text-muted hover:bg-white/5 hover:text-white',
          )}
        >
          {COMPETITION_STATS_GENERAL.CHART.TOGGLE_RANKS}
        </button>
        <button
          type="button"
          onClick={() => setChartMode('points')}
          className={cn(
            'px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-default cursor-pointer',
            chartMode === 'points'
              ? 'bg-gold text-dark font-black'
              : 'text-text-muted hover:bg-white/5 hover:text-white',
          )}
        >
          {COMPETITION_STATS_GENERAL.CHART.TOGGLE_POINTS}
        </button>
      </div>

      {/* 📊 3. CARTE DU GRAPHIQUE */}
      <Card
        variant={CARD_VARIANT.DARK}
        className="w-full border-border-subtle p-4 mt-2 relative overflow-visible"
      >
        {/* Le bouton Agrandir reste en absolute discret en haut à droite */}
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant={BUTTON_VARIANT.SECONDARY}
            size={BUTTON_SIZE.SMALL}
            onClick={onOpenFullscreen}
            icon={ICONS.MAXIMIZE}
          >
            <span className="sm:hidden">{ICONS.MAXIMIZE}</span>
            <span className="hidden sm:block">
              {COMPETITION_STATS_GENERAL.CHART.BTN_MAXIMIZE}
            </span>
          </Button>
        </div>

        <div className="w-full">{renderActiveChart('h-64 sm:h-96')}</div>

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

      {/* 📱 4. MODALE PLEIN ÉCRAN */}
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
              icon={ICONS.CANCEL}
            >
              {COMPETITION_STATS_GENERAL.CHART.BTN_CLOSE}
            </Button>
          </Row>
          <div className="p-2 sm:p-6 flex-1 min-h-0 w-full overflow-y-auto flex flex-col">
            {renderActiveChart('flex-1 min-h-64 sm:h-96')}
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
