import { useState } from 'react';
import { useEnrollment } from '../../hooks/useEnrollment';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

export const InlineEnrollment = ({
  competition,
  onRefresh,
}: {
  competition: any;
  onRefresh: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
  } = useEnrollment(competition.id, competition.players || [], () => {
    setIsOpen(false);
    onRefresh();
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 py-3 border-2 border-dashed border-white/5 rounded-xm text-white/20 hover:border-gold/30 hover:text-gold transition-all text-[10px] font-black uppercase tracking-widest"
      >
        + Ajouter un joueur
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-gold/20 animate-slide-up">
      <div className="relative">
        <Input
          autoFocus
          placeholder="Chercher ou créer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        )}
      </div>

      <div className="mt-2 space-y-1">
        {searchResults.map((p) => (
          <button
            key={p.id}
            onClick={() => addExistingPlayer(p)}
            className="w-full text-left p-2 hover:bg-gold/10 rounded-lg text-xs text-white/60 flex justify-between items-center transition-colors"
          >
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-bold truncate">
                  {p.display_name || p.displayName}
                </span>
                <span className="text-[9px] text-gold/40 font-mono italic truncate">
                  @{p.username}
                </span>
              </div>
              {p.last_competition_name ? (
                <span className="text-[8px] text-white/30 uppercase tracking-tighter truncate">
                  Dernièrement vu : {p.last_competition_name}
                </span>
              ) : (
                <span className="text-[8px] text-blue-400/40 uppercase tracking-tighter">
                  Nouveau joueur 🐣
                </span>
              )}
            </div>
            <div className="ml-2 flex-shrink-0 opacity-30 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
              <span className="text-[10px] bg-white/10 text-white px-2 py-1 rounded uppercase font-black">
                +
              </span>
            </div>
          </button>
        ))}

        {searchTerm.trim().length >= 2 &&
          !searchResults.find(
            (p) =>
              (p.display_name || p.displayName).toLowerCase() ===
              searchTerm.toLowerCase(),
          ) && (
            <button
              onClick={() => addNewPlayer(searchTerm)}
              className="w-full text-left p-2 bg-gold/5 hover:bg-gold/10 rounded-lg text-xs text-gold font-bold transition-all"
            >
              + Créer "{searchTerm}"
            </button>
          )}
      </div>

      {participants.length > (competition.players?.length || 0) && (
        <div className="mt-3 flex flex-wrap gap-1 border-t border-white/5 pt-3">
          {participants
            .filter(
              (p) => !competition.players?.find((cp: any) => cp.id === p.id),
            )
            .map((p) => (
              <span
                key={p.id}
                className="bg-gold text-dark px-2 py-0.5 rounded text-[9px] font-black uppercase"
              >
                {p.display_name}
              </span>
            ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          fullWidth
          onClick={saveEnrollment}
          isLoading={loading}
          className="text-[10px] py-2"
        >
          Valider le recrutement
        </Button>
        <button
          onClick={() => setIsOpen(false)}
          className="px-3 text-white/20 hover:text-white transition-colors text-[9px] font-bold uppercase"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};
