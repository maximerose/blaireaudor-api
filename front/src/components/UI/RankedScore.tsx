import {
  getRankTextColor,
  getRankGlow,
  getRankAnimation,
} from '../../utils/rankStyles';

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

  return (
    <div className="flex items-baseline gap-1 font-mono font-black">
      <span
        className={`
        transition-all duration-700 
        ${getRankTextColor(rank)} 
        ${getRankGlow(rank)} 
        ${getRankAnimation(rank)}
        ${finalSize}
      `}
      >
        {score}
      </span>
      <span className="uppercase tracking-tighter text-white/20 text-[8px] md:text-[10px]">
        pts
      </span>
    </div>
  );
};
