import { getRankBadgeStyle, getRankMedal } from '../../utils/rankStyles';

interface RankBadgeProps {
  rank: number;
}

export const RankBadge = ({ rank }: RankBadgeProps) => {
  const medal = getRankMedal(rank);
  const suffix = rank === 1 ? 'er' : 'ème';

  return (
    <div className="flex items-center gap-2">
      {medal && (
        <span className="text-2xl drop-shadow-md animate-bounce-subtle">
          {medal}
        </span>
      )}
      <span
        className={`
        px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-tighter 
        ${getRankBadgeStyle(rank)}
      `}
      >
        {rank}
        {suffix}
      </span>
    </div>
  );
};
