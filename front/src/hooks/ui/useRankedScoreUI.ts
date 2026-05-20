import { cn } from '@/shared';

const RANK_SIZES: Record<number, string> = {
  1: 'text-2xl md:text-3xl',
  2: 'text-xl md:text-2xl',
  3: 'text-xl md:text-2xl',
};

const RANK_STYLES: Record<number, string> = {
  1: 'text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] animate-pulse-subtle',
  2: 'text-silver drop-shadow-[0_0_8px_rgba(168,168,168,0.3)]',
  3: 'text-bronze drop-shadow-[0_0_8px_rgba(140,89,59,0.3)]',
};

export const useRankedScoreUI = (score: number | string, rank: number) => {
  const finalSize = RANK_SIZES[rank] || 'text-sm md:text-base';
  const finalStyle = RANK_STYLES[rank] || 'text-white/80';

  const ariaLabel = (() => {
    const pointsStr = `${score} points`;
    if (rank === 1) return `Score exceptionnel de ${pointsStr}`;
    if (rank <= 3) return `Top score de ${pointsStr}`;
    return pointsStr;
  })();

  const scoreClasses = cn(
    'font-black transition-default',
    finalStyle,
    finalSize,
    rank === 1 && 'motion-reduce:animate-none',
  );

  return { ariaLabel, scoreClasses };
};
