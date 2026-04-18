import { Input } from '../UI/Input';

interface Props {
  searchProps: {
    search: (query: string) => void;
    results: any[];
    searching: boolean;
    onSelect: (player: any) => void;
    onClear: () => void;
    isLinked: boolean;
  };
  selectedName?: string;
}

export const HistoricalPlayerSearch = ({
  searchProps,
  selectedName,
}: Props) => {
  const { search, results, searching, onSelect, onClear, isLinked } =
    searchProps;

  if (isLinked) {
    return (
      <div className="mb-6 p-4 bg-green-500/10 border-green-500/30 rounded-2xl flex justify-between items-center animate-fade-in">
        <div>
          <p className="text-[10px] text-green-500 uppercase font-bold tracking-wider">
            Profil lié
          </p>
          <p className="text-white font-medium">{selectedName}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] text-white/40 hover:text-white underline transition-colors"
        >
          Changer
        </button>
      </div>
    );
  }

  return (
    <div className="relative mb-6">
      <Input
        label="Déjà participé ?"
        placeholder="Cherche ton nom..."
        onChange={(e) => search(e.target.value)}
        icon={searching ? '⏳' : '🔍'}
      />
      {results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-gold/30 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
          {results.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => onSelect(player)}
              className="w-full p-3 text-left hover:bg-gold/10 border-b border-white/5 last:border-0 transition-colors flex justify-between items-center"
            >
              <div>
                <div className="text-white font-bold">
                  {player.display_name}
                </div>
                <div className="text-[10px] text-gold/50">
                  @{player.username}
                </div>
              </div>
              <span className="text-[10px] font-bold text-gold uppercase tracking-tighter">
                C'est moi
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
