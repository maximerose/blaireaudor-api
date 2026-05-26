import { useState, useEffect, useMemo } from 'react';
import { useAuthContext } from '@/features/account';
import { useCompetitionContext } from '@/features/competition/context';
import { useCompetitionStats } from '@/features/stats/hooks';
import {
  COMPETITION_STATS_CATEGORIES,
  COMPETITION_STATS_GENERAL,
} from '@/features/stats/constants';
import type {
  ChartFilter,
  CategoryItem,
  HintModalData,
  StatFocusData,
} from '@/features/stats/types';

export const useCompetitionStatsTabUI = () => {
  const { user } = useAuthContext();
  const { leaderboard } = useCompetitionContext();
  const { stats, dailyEvolution, isLoading, canViewStats } =
    useCompetitionStats();

  const [activeHint, setActiveHint] = useState<HintModalData | null>(null);
  const [hiddenLines, setHiddenLines] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<ChartFilter>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const myPlayerId = user?.player?.id;
  const myParticipation = useMemo(
    () => leaderboard.find((p) => p.player.id === myPlayerId),
    [leaderboard, myPlayerId],
  );

  // --- PREPARATION BUMP DATA ---
  const bumpData = useMemo(() => {
    return dailyEvolution.map((day) => {
      const playerScores = Object.entries(day)
        .filter(([key]) => key !== 'date')
        .map(([id, score]) => ({ id, score: score as number }))
        .sort((a, b) => b.score - a.score);

      const dayRanks: any = { date: day.date, rawScores: day };
      let currentRank = 1;
      let lastScore: number | null = null;

      playerScores.forEach((ps, index) => {
        if (ps.score !== lastScore) {
          currentRank = index + 1;
          lastScore = ps.score;
        }
        dayRanks[ps.id] = currentRank;
      });

      return dayRanks;
    });
  }, [dailyEvolution]);

  // --- FILTRES DU GRAPHIQUE ---
  const handleFilterChange = (filter: ChartFilter) => {
    setActiveFilter(filter);
    const newHidden: Record<string, boolean> = {};

    if (filter !== 'all') {
      const limit =
        filter === 'top3'
          ? 3
          : filter === 'top5'
            ? 5
            : filter === 'top10'
              ? 10
              : 0;
      leaderboard.forEach((p) => {
        if (p.rank > limit && p.player.id !== myPlayerId)
          newHidden[p.player.id] = true;
      });
    }
    setHiddenLines(newHidden);
  };

  const handleLegendClick = (key: string) => {
    setActiveFilter('all');
    setHiddenLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (
      leaderboard.length > 5 &&
      activeFilter === 'all' &&
      Object.keys(hiddenLines).length === 0
    ) {
      handleFilterChange('top5');
    }
  }, [leaderboard.length]);

  // --- FULLSCREEN PAYSAGE ---
  const openFullscreenLandscape = async () => {
    setIsFullscreen(true);
    try {
      const elem = document.documentElement as any;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen)
        await elem.webkitRequestFullscreen();
      if (
        window.screen &&
        screen.orientation &&
        (screen.orientation as any).lock
      )
        await (screen.orientation as any).lock('landscape');
    } catch {
      /* Ignoré silencieusement */
    }
  };

  const closeFullscreenLandscape = async () => {
    setIsFullscreen(false);
    try {
      if (window.screen && screen.orientation && screen.orientation.unlock)
        screen.orientation.unlock();
      if (document.fullscreenElement && document.exitFullscreen)
        await document.exitFullscreen();
      else if (
        (document as any).webkitFullscreenElement &&
        (document as any).webkitExitFullscreen
      )
        await (document as any).webkitExitFullscreen();
    } catch {
      /* Ignoré silencieusement */
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        !(document as any).webkitFullscreenElement
      ) {
        setIsFullscreen(false);
        if (window.screen && screen.orientation && screen.orientation.unlock)
          screen.orientation.unlock();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const maxSingleActionMapped = useMemo((): StatFocusData | null => {
    const record = stats?.max_points_single_action;
    if (!record) return null;

    const involvedName = record.player_name;
    return {
      points: record.points,
      description: record.description,
      competitionName: '',
      involvedName,
      date: record.date_action ? record.date_action.split('T')[0] : undefined,
      prefixOverride: COMPETITION_STATS_GENERAL.FOCUS.PREFIX_OVERRIDE,
      isMe: Boolean(
        involvedName &&
        user?.player?.display_name &&
        involvedName === user.player.display_name,
      ),
    };
  }, [stats, user]);

  const categories = useMemo((): CategoryItem[] => {
    if (!stats) return [];

    return COMPETITION_STATS_CATEGORIES.map((category) => ({
      title: category.title,
      metrics: category.metrics.map((metric) => ({
        id: metric.id,
        label: metric.getLabel(),
        icon: metric.icon,
        color: metric.getColor(),
        val: metric.getValue(stats),
        subtext: metric.getSubtext ? metric.getSubtext(stats) : undefined,
        hint: metric.hint,
      })),
    }));
  }, [stats]);

  return {
    canViewStats,
    isLoading,
    dailyEvolution,
    leaderboard,
    myPlayerId,
    myParticipation,
    bumpData,
    activeHint,
    setActiveHint,
    hiddenLines,
    handleLegendClick,
    activeFilter,
    handleFilterChange,
    isFullscreen,
    openFullscreenLandscape,
    closeFullscreenLandscape,
    categories,
    maxSingleActionMapped,
  };
};
