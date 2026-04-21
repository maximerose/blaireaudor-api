import { useState } from 'react';
import { useEnrollment } from '../../hooks/useEnrollment';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { PlayerSearchResultItem } from '../UI/PlayerSearchResultItem';

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
      <Button variant="ghost" fullWidth onClick={() => setIsOpen(true)}>
        + Ajouter un joueur
      </Button>
    );
  }

  return (
    <Card variant="dark" className="mt-4 p-4 border-gold/20 animate-slide-up">
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
          <PlayerSearchResultItem
            key={p.id}
            player={p}
            onClick={addExistingPlayer}
            actionIcon="Ajouter"
          />
        ))}

        {searchTerm.trim().length >= 2 &&
          !searchResults.find(
            (p) =>
              (p.display_name || p.displayName).toLowerCase() ===
              searchTerm.toLowerCase(),
          ) && (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => addNewPlayer(searchTerm)}
              className="mt-2"
            >
              + Créer "{searchTerm}"
            </Button>
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
        <Button fullWidth onClick={saveEnrollment} isLoading={loading}>
          Valider le recrutement
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(false)}
          className="px-3"
        >
          Annuler
        </Button>
      </div>
    </Card>
  );
};
