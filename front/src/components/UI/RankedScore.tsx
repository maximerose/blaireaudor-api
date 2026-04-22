interface RankedScoreProps {
  score: number | string;
  rank: number;
}

export const RankedScore = ({ score, rank }: RankedScoreProps) => {
  const sizes = {
    sm: 'text-sm md:text-base',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
  };

  const finalSize = rank === 1 ? sizes.lg : rank <= 3 ? sizes.md : sizes.sm;

  const getRankStyle = (r: number) => {
    if (r === 1)
      return 'text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] animate-pulse-subtle';
    if (r === 2)
      return 'text-silver drop-shadow-[0_0_8px_rgba(168,168,168,0.3)]';
    if (r === 3) return 'text-bronze drop-shadow-[0_0_8px_rgba(140,89,59,0.3)]';
    return 'text-white/80';
  };

  return (
    <div className="flex items-baseline gap-1 font-mono font-black tabular-nums">
      <span
        className={`
          transition-all duration-700
          ${getRankStyle(rank)}
          ${finalSize}
        `}
      >
        {score}
      </span>

      <span className="uppercase tracking-[0.2em] text-white/20 text-[7px] md:text-[9px] font-bold">
        pts
      </span>
    </div>
  );
};
