import { useEnrollment } from '../../hooks/useEnrollment';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Card } from '../UI/Card';
import { Text } from '../UI/Typography';
import { Badge } from '../UI/Badge';
import { cn } from '../../utils/cn';

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
    <div
      className="space-y-6"
      role="section"
      aria-label="Recrutement des joueurs"
    >
      <div className="text-center space-y-1">
        <Text variant="h2" className="italic">
          Recrutement
        </Text>
        <Text variant="caption" className="text-gold opacity-40">
          Arène : {competition.name}
        </Text>
      </div>

      <div className="relative space-y-2">
        <div className="flex gap-2 items-end">
          <div className="relative flex-1">
            <Input
              label="Chercher un joueur"
              icon="🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: Martin..."
              align="left"
              className="pr-10"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={searchResults.length > 0}
              aria-controls="enrollment-search-results"
            />
            {isSearching && (
              <div className="absolute right-3 bottom-3" aria-hidden="true">
                <div className="w-3 h-3 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            )}
          </div>

          {searchTerm.trim().length >= 2 && (
            <Button
              onClick={() => addNewPlayer(searchTerm)}
              size="sm"
              className="h-10.5 px-4"
              aria-label={`Créer et ajouter le joueur ${searchTerm}`}
            >
              Nouveau
            </Button>
          )}
        </div>

        {searchResults.length > 0 && (
          <Card
            id="enrollment-search-results"
            role="listbox"
            variant="dark"
            className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden border-gold/30 bg-black/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="max-h-60 overflow-y-auto no-scrollbar divide-y divide-white/5">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="option"
                  onClick={() => addExistingPlayer(p)}
                  className="w-full p-3 hover:bg-gold/10 cursor-pointer flex justify-between items-center group transition-colors focus:bg-gold/10 focus:outline-none"
                >
                  <Text
                    variant="body"
                    className="font-bold group-hover:text-gold"
                  >
                    {p.display_name || p.displayName}
                  </Text>
                  <Text variant="mono" className="text-gold/30 text-[9px]">
                    @{p.username || 'externe'}
                  </Text>
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div
        className={cn(
          'flex flex-wrap gap-2 min-h-16 p-4 rounded-2xl border transition-all',
          participants.length > 0
            ? 'bg-gold/5 border-gold/20'
            : 'bg-dark/30 border-white/5',
        )}
        role="list"
        aria-live="polite"
        aria-label="Joueurs sélectionnés"
      >
        {participants.length > 0 ? (
          participants.map((p) => (
            <Badge
              key={p.id}
              role="listitem"
              variant="gold"
              className="animate-fade-in py-1 px-3"
            >
              {p.display_name || p.displayName}
            </Badge>
          ))
        ) : (
          <Text variant="micro" className="m-auto opacity-20">
            Aucun joueur sélectionné
          </Text>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Button
          onClick={saveEnrollment}
          isLoading={loading}
          fullWidth
          size="lg"
          aria-live="assertive"
        >
          {loading ? 'Ajout des joueurs...' : 'Ajouter les joueurs'}
        </Button>
      </div>
    </div>
  );
};
