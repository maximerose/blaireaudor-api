import { useEnrollment } from '../../hooks/useEnrollment';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

export const PlayerEnrollmentView = ({ competition }: { competition: any }) => {
  const {
    participants,
    searchResults,
    searchTerm,
    setSearchTerm,
    addExistingPlayer,
    addNewPlayer,
    saveEnrollment,
    loading,
    isSearching,
  } = useEnrollment(competition.id, competition.players || []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-black text-white uppercase italic">
          Recrutement
        </h2>
        <p className="text-gold/40 text-[10px] font-bold uppercase tracking-widest">
          Arène : {competition.name}
        </p>
      </div>

      <div className="relative">
        <label className="text-gold/80 text-sm ml-1 italic font-bold">
          Chercher un joueur
        </label>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Input
              icon="🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: Martin..."
              className="pl-10 text-left"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {searchTerm.trim().length >= 2 && (
            <Button
              onClick={() => addNewPlayer(searchTerm)}
              className="uppercase text-[10px] h-[38px] px-3"
            >
              Nouveau
            </Button>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-gold/30 rounded-xl shadow-2xl z-50 overflow-hidden">
            {searchResults.map((p) => (
              <div
                key={p.id}
                onClick={() => addExistingPlayer(p)}
                className="p-3 hover:bg-gold/10 cursor-pointer text-xs text-white border-b border-white/5 last:border-0 flex justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-bold group-hover:text-gold transition-colors">
                    {p.display_name || p.displayName}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-gold/30 text-[9px] font-bold italic">
                    @{p.username || 'Joueur externe'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 min-h-15 p-4 bg-dark/30 rounded-2xl border border-white/5">
        {participants.map((p) => (
          <div
            key={p.id}
            className="bg-gold/10 border border-gold/30 text-gold px-3 py-1 rounded-full text-[10px] font-bold animate-fade-in"
          >
            {p.display_name || p.displayName}
          </div>
        ))}
      </div>

      <Button
        onClick={saveEnrollment}
        disabled={loading}
        fullWidth
        className="text-sm py-3"
      >
        {loading ? 'Ajout des joueurs...' : 'Ajouter les joueurs'}
      </Button>
      <a
        href={`http://localhost:8080/api/competitions/${competition.id}`}
        target="_blank"
        rel="noreferrer"
        className="text-center text-gold/30 text-[9px] uppercase hover:text-gold transition-colors"
      >
        Ouvrir la donnée brute (JSON)
      </a>
    </div>
  );
};
