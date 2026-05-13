import { getRankMedal } from '@/utils';
import { BADGE_VARIANT, type BadgeVariant } from '@/components/UI';

const RANK_VARIANTS: Record<number, BadgeVariant> = {
  1: BADGE_VARIANT.GOLD,
  2: BADGE_VARIANT.SILVER,
  3: BADGE_VARIANT.BRONZE,
};

const BADGE_SHADOWS: Record<number, string> = {
  1: 'shadow-[0_0_12px_rgba(212,175,55,0.25)] border-gold/30',
  2: 'shadow-[0_0_10px_rgba(168,168,168,0.20)] border-silver/30',
  3: 'shadow-[0_0_10px_rgba(140,89,59,0.20)] border-bronze/30',
};

const MEDAL_SHADOWS: Record<number, string> = {
  1: 'drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]',
  2: 'drop-shadow-[0_0_8px_rgba(168,168,168,0.4)]',
  3: 'drop-shadow-[0_0_8px_rgba(140,89,59,0.4)]',
};

export const useRankBadgeUI = (rank: number) => {
  const medal = getRankMedal(rank);
  const suffix = rank === 1 ? 'er' : 'ème';
  const srText = rank === 1 ? 'premier' : `${rank}ième`;

  const variant = RANK_VARIANTS[rank] || BADGE_VARIANT.GHOST;
  const badgeShadow = BADGE_SHADOWS[rank] || 'opacity-60 border-white/5';
  const medalShadow = MEDAL_SHADOWS[rank] || '';

  return {
    medal,
    suffix,
    srText,
    variant,
    badgeShadow,
    medalShadow,
  };
};
