import { getRankMedal } from '../../utils/rankStyles';
import { Badge, type BadgeVariant } from './Badge';

interface RankBadgeProps {
  rank: number;
}

export const RankBadge = ({ rank }: RankBadgeProps) => {
  const medal = getRankMedal(rank);
  const suffix = rank === 1 ? 'er' : 'ème';

  const getRankVariant = (r: number): BadgeVariant => {
    if (r === 1) return 'gold';
    if (r === 2) return 'silver';
    if (r === 3) return 'bronze';
    return 'ghost';
  };

  const getRankShadow = (r: number) => {
    if (r === 1)
      return 'shadow-[0_0_12px_rgba(212,175,55,0.25)] border-gold/30';
    if (r === 2)
      return 'shadow-[0_0_10px_rgba(168,168,168,0.20)] border-silver/30';
    if (r === 3)
      return 'shadow-[0_0_10px_rgba(140,89,59,0.20)] border-bronze/30';
    return 'opacity-60 border-white/5';
  };

  return (
    <div className="flex items-center gap-2">
      {medal && (
        <span
          className={`
            text-2xl animate-bounce-subtle
            ${rank === 1 ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : ''}
            ${rank === 2 ? 'drop-shadow-[0_0_8px_rgba(168,168,168,0.4)]' : ''}
            ${rank === 3 ? 'drop-shadow-[0_0_8px_rgba(140,89,59,0.4)]' : ''}
          `}
          role="img"
          aria-label={`médaille ${getRankVariant(rank)}`}
        >
          {medal}
        </span>
      )}

      <Badge
        variant={getRankVariant(rank)}
        className={`
          px-2.5 py-0.5 text-[10px] font-black italic transition-all duration-500
          ${getRankShadow(rank)}
        `}
      >
        <span className="flex items-baseline">
          {rank}
          <span className="text-[7px] lowercase ml-0.5 opacity-70 font-bold">
            {suffix}
          </span>
        </span>
      </Badge>
    </div>
  );
};
