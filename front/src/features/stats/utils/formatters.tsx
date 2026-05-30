import { ICONS, pluralize } from '@/shared';

export const fmtPoints = (pts: number | string) => (
  <span className="flex items-baseline justify-center gap-1">
    {pts} <span className="text-xs opacity-50 font-normal lowercase">pts</span>
  </span>
);

export const fmtPointsPerAction = (pts: number | string) => (
  <span className="flex items-baseline justify-center gap-1">
    {pts}{' '}
    <span className="text-xs opacity-50 font-normal lowercase">
      pts / action
    </span>
  </span>
);

export const fmtPercent = (val: number | string | null) =>
  val !== null ? (
    <span className="flex items-baseline justify-center gap-1">
      {val} <span className="text-xs opacity-50 font-normal lowercase">%</span>
    </span>
  ) : (
    '-'
  );

export const fmtActions = (count: number, word = 'action') => (
  <span className="flex items-baseline justify-center gap-1">
    {count}{' '}
    <span className="text-xs opacity-50 font-normal lowercase">
      {pluralize(count, word)}
    </span>
  </span>
);

export const fmtRank = (rank: number | null) =>
  rank ? `${rank}${rank === 1 ? 'er' : 'ème'}` : '-';

export const fmtNames = (names?: string[]) => {
  if (!names || names.length === 0) return 'Aucun';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} et ${names[1]}`;
  return `${names.length} ex-aequo`;
};

export const fmtPairs = (pairs?: { player1: string; player2: string }[]) => {
  if (!pairs || pairs.length === 0) return 'Aucune';
  if (pairs.length === 1) {
    return (
      <span className="flex flex-col items-center justify-center gap-1.5 text-[0.85em]">
        <span className="truncate">{pairs[0].player1}</span>
        <span
          className="text-danger-bright opacity-80 shrink-0 animate-pulse-subtle"
          aria-hidden="true"
        >
          {ICONS.STAB}
        </span>
        <span className="truncate">{pairs[0].player2}</span>
      </span>
    );
  }
  return `${pairs.length} paires ex-aequo`;
};
