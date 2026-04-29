import {
  Input,
  Button,
  Card,
  PlayerSearchResultItem,
  Text,
} from '@/components/UI';
import { useInlineEnrollmentUI } from '@/hooks';
import { SelectedPlayerBadge } from '@/components/Competition';

export const InlineEnrollment = ({
  competition,
  onRefresh,
}: {
  competition: any;
  onRefresh: () => void;
}) => {
  const {
    isOpen,
    setIsOpen,
    isOwner,
    newPlayers,
    canCreatePlayer,
    searchResults,
    searchTerm,
    setSearchTerm,
    addExistingPlayer,
    addNewPlayer,
    removePlayer,
    saveEnrollment,
    loading,
    isSearching,
  } = useInlineEnrollmentUI(competition, onRefresh);

  if (!isOwner) return null;

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        fullWidth
        onClick={() => setIsOpen(true)}
        className="border-dashed border-white/5 py-4 mt-4 transition-default hover:bg-white/5"
        aria-expanded="false"
      >
        + Ajouter un joueur
      </Button>
    );
  }

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

        {canCreatePlayer && (
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => addNewPlayer(searchTerm)}
            className="border-dashed border-white/10 italic normal-case transition-default hover:border-gold/30"
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
            <SelectedPlayerBadge
              key={p.id}
              player={p}
              onRemove={removePlayer}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-2">
        <Button
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
          className="px-4 transition-default shrink-0"
          aria-label="Annuler le recrutement"
        >
          Annuler
        </Button>
      </div>
    </Card>
  );
};
