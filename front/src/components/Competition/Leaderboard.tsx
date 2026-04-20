interface LeaderboardProps {
  data: any[];
}

export const Leaderboard = ({ data }: LeaderboardProps) => {
  return (
    <div className="bg-black/20 border border-gold/10 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-12 gap-2 p-3 bg-gold/10 text-[10px] font-black uppercase tracking-widest text-gold/60">
        <div className="col-span-2 text-center">#</div>
        <div className="col-span-7">Joueur</div>
        <div className="col-span-3 text-right">Points</div>
      </div>
      <div className="divide-y divide-white/5">
        {data.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-colors"
          >
            <div className="col-span-2 text-center font-black text-gold/80">
              {index + 1}
            </div>
            <div className="col-span-7 font-bold text-white text-sm">
              {item.player.display_name}
            </div>
            <div className="col-span-3 text-right font-mono font-bold text-gold">
              {item.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
