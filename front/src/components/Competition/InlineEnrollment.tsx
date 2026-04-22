import { useState } from 'react';
import { useEnrollment } from '../../hooks/useEnrollment';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { PlayerSearchResultItem } from '../UI/PlayerSearchResultItem';
import { Text } from '../UI/Typography';
import { Badge } from '../UI/Badge';
import { useAuth } from '../../hooks/useAuth';

export const InlineEnrollment = ({
  competition,
  onRefresh,
}: {
  competition: any;
  onRefresh: () => void;
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const isOwner =
    user?.id === competition?.created_by?.id ||
    user?.id === competition?.created_by;

  if (!isOwner) {
    return null;
  }

  const {
    participants,
    searchResults,
    searchTerm,
    setSearchTerm,
    addExistingPlayer,
    addNewPlayer,
    removePlayer,
    saveEnrollment,
    loading,
    isSearching,
  } = useEnrollment(competition.id, competition.players || [], () => {
    setIsOpen(false);
    onRefresh();
  });

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        fullWidth
        onClick={() => setIsOpen(true)}
        className="border-dashed border-white/5 py-4"
      >
        + Ajouter un joueur
      </Button>
    );
  }

  return (
    <Card
      variant="dark"
      className="mt-4 p-4 border-gold/20 animate-slide-up relative"
    >
      <div className="flex justify-center items-center mb-4 px-1">
        <Text variant="caption" className="text-gold/50">
          Nouveau recrutement
        </Text>
      </div>

      <div className="relative mb-4">
        <Input
          autoFocus
          align="center"
          placeholder="Chercher ou créer un blaireau..."
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          icon={isSearching ? '⏳' : '🔍'}
          className="bg-black/40"
        />

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 animate-slide-up">
            <Card
              variant="dark"
              className="overflow-hidden border-gold/30 shadow-2xl backdrop-blur-xl bg-black/95 max-h-56 overflow-y-auto no-scrollbar"
            >
              {searchResults.map((p) => (
                <PlayerSearchResultItem
                  key={p.id}
                  player={p}
                  onClick={addExistingPlayer}
                  actionIcon="Ajouter"
                />
              ))}
            </Card>
          </div>
        )}

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
              className="mt-2 border-dashed border-white/10 lowercase italic"
            >
              + créer "{searchTerm}"
            </Button>
          )}
      </div>

      {participants.length > (competition.players?.length || 0) && (
        <div className="flex flex-wrap gap-2 py-3 border-t border-white/5">
          {participants
            .filter(
              (p) => !competition.players?.find((cp: any) => cp.id === p.id),
            )
            .map((p) => (
              <Badge
                key={p.id}
                variant="gold"
                className="pl-3 pr-1.5 py-1 rounded-full animate-fade-in border-gold/20 flex items-center gap-2 group/chip"
              >
                <span className="text-[9px] font-black uppercase">
                  {p.display_name}
                </span>
                <button
                  type="button"
                  onClick={() => removePlayer(p.id)}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-gold/40 hover:bg-danger/20 hover:text-danger-bright transition-colors"
                  title="Retirer"
                >
                  ✕
                </button>
              </Badge>
            ))}
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <Button
          fullWidth
          onClick={saveEnrollment}
          isLoading={loading}
          disabled={participants.length <= (competition.players?.length || 0)}
        >
          Valider
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(false)}
          className="px-4"
        >
          Annuler
        </Button>
      </div>
    </Card>
  );
};
