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

  if (!isOwner) return null;

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        fullWidth
        onClick={() => setIsOpen(true)}
        className="border-dashed border-white/5 py-4 mt-4"
        aria-expanded="false"
      >
        + Ajouter un joueur
      </Button>
    );
  }

  const newPlayers = participants.filter(
    (p) => !competition.players?.find((cp: any) => cp.id === p.id),
  );

  return (
    <Card
      variant="dark"
      className="mt-4 p-4 border-gold/20 animate-slide-up relative"
      role="section"
      aria-label="Formulaire de recrutement"
    >
      <div className="flex justify-center items-center mb-4">
        <Text variant="caption" className="text-gold">
          Nouveau recrutement
        </Text>
      </div>

      <div className="relative mb-4 space-y-2">
        <Input
          autoFocus
          align="center"
          label="Chercher un joueur"
          placeholder="Nom du blaireau..."
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          icon={isSearching ? '⏳' : '🔍'}
          className="bg-black/40"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={searchResults.length > 0}
          aria-controls="search-results-list"
        />

        {searchResults.length > 0 && (
          <Card
            id="search-results-list"
            role="listbox"
            variant="dark"
            className="absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden border-gold/30 shadow-2xl backdrop-blur-xl bg-black/95 max-h-56 overflow-y-auto no-scrollbar"
          >
            {searchResults.map((p) => (
              <PlayerSearchResultItem
                key={p.id}
                player={p}
                role="option"
                onClick={addExistingPlayer}
                actionIcon="Ajouter"
              />
            ))}
          </Card>
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
              className="border-dashed border-white/10 italic normal-case"
              aria-label={`Créer le nouveau joueur ${searchTerm}`}
            >
              <Text variant="micro" className="opacity-100">
                + créer "{searchTerm}"
              </Text>
            </Button>
          )}
      </div>

      {newPlayers.length > 0 && (
        <div
          className="flex flex-wrap gap-2 py-3 border-t border-white/5"
          role="list"
          aria-label="Joueurs sélectionnés pour le recrutement"
        >
          {newPlayers.map((p) => (
            <Badge
              key={p.id}
              role="listitem"
              variant="gold"
              className="pl-3 pr-1 py-1 animate-fade-in flex items-center gap-2"
            >
              <Text variant="micro" className="opacity-100 font-black">
                {p.display_name}
              </Text>
              <button
                type="button"
                onClick={() => removePlayer(p.id)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-gold/40 hover:bg-danger/20 hover:text-danger-bright transition-all cursor-pointer"
                aria-label={`Retirer ${p.display_name}`}
                title="Retirer"
              >
                <span aria-hidden="true">✕</span>
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
          disabled={newPlayers.length === 0}
          aria-live="polite"
        >
          Recruter ({newPlayers.length})
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(false)}
          className="px-4"
          aria-label="Annuler le recrutement"
        >
          Annuler
        </Button>
      </div>
    </Card>
  );
};
