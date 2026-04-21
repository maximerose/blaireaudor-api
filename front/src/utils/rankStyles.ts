export const getRankTextColor = (rank: number) => {
  if (rank === 1) return 'text-[#FFD700]'; // Or
  if (rank === 2) return 'text-[#C0C0C0]'; // Argent
  if (rank === 3) return 'text-[#CD7F32]'; // Bronze
  return 'text-gold/60';
};

export const getRankBadgeStyle = (rank: number) => {
  if (rank === 1) return 'text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/10';
  if (rank === 2) return 'text-[#C0C0C0] border-[#C0C0C0]/30 bg-[#C0C0C0]/10';
  if (rank === 3) return 'text-[#CD7F32] border-[#CD7F32]/30 bg-[#CD7F32]/10';
  return 'text-gold/50 border-gold/10 bg-white/5';
};

export const getRankGlow = (rank: number) => {
  if (rank === 1) return 'drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]';
  if (rank === 2) return 'drop-shadow-[0_0_8px_rgba(192,192,192,0.3)]';
  if (rank === 3) return 'drop-shadow-[0_0_8px_rgba(205,127,50,0.3)]';
  return '';
};

export const getRankAnimation = (rank: number) => {
  if (rank === 1) return 'animate-pulse';
  return '';
};

export const getRankMedal = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

export const getMedalStyle = (rank: number) => {
  if (rank === 1) return 'drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] text-2xl';
  if (rank === 2) return 'drop-shadow-[0_0_8px_rgba(192,192,192,0.4)] text-2xl';
  if (rank === 3) return 'drop-shadow-[0_0_8px_rgba(205,127,50,0.4)] text-2xl';
  return '';
};
