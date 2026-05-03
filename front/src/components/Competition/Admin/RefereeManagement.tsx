import { Badge, PlayerSearchResultItem, Text } from '@/components/UI';
import { useRefereeManagementUI } from '@/hooks/competition/useRefereeManagementUI';
import type { Competition, Player } from '@/types';

interface RefereeManagementProps {
  competition: Competition;
  currentUser: any;
  onRefresh: () => void;
}

export const RefereeManagement = ({
  competition,
  currentUser,
  onRefresh,
}: RefereeManagementProps) => {
  const {
    referees,
    isLastRef,
    loadingAction,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    handleAdd,
    handleRemoveRequest,
  } = useRefereeManagementUI(competition, onRefresh);

  const myPlayerId = currentUser?.user?.player?.id
    ? String(currentUser.user.player.id)
    : null;

  return (
    <div className="space-y-4 pt-6 border-t border-white/10">
      <header>
        <Text variant="h3">Équipe d'arbitrage</Text>
        <Text variant="caption" className="opacity-60 text-[10px]">
          Coopter des membres pour vous aider ou quitter votre poste.
        </Text>
      </header>

      {/* Liste des arbitres actuels */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {referees.map((ref: any) => {
          const isMe = String(ref.id) === myPlayerId;
          const isRemoving = loadingAction === `remove-${ref.id}`;
          const canRemove = (!isLastRef && isMe) || (!isMe && myPlayerId);

          return (
            <Badge
              key={ref.id}
              variant="info"
              className={`flex items-center gap-2 pr-1 py-1 ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span className="flex items-center gap-1">
                ⚖️ {ref.name}{' '}
                {isMe && (
                  <span className="text-[9px] opacity-70 uppercase tracking-wider">
                    (Vous)
                  </span>
                )}
              </span>

              {canRemove && (
                <button
                  onClick={() => handleRemoveRequest(ref, isMe)}
                  disabled={isRemoving}
                  className="hover:text-danger text-white/40 hover:bg-white/10 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                  title={isMe ? 'Démissionner' : 'Révoquer cet arbitre'}
                  aria-label="Révoquer"
                >
                  ✕
                </button>
              )}
            </Badge>
          );
        })}
      </div>

      {isLastRef && (
        <Text variant="micro" className="text-warning-bright/80 italic block">
          ⚠️ Vous êtes le dernier arbitre. Ajoutez un successeur avant de
          pouvoir démissionner.
        </Text>
      )}

      {/* Barre de recherche globale avec bouton vider */}
      <div className="flex justify-center w-full pt-2">
        <div className="relative w-full sm:max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un joueur (2 lettres min)..."
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-3 pr-10 text-sm text-white w-full focus:border-gold/50 outline-none transition-colors"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-1"
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}
          </div>

          {isSearching && (
            <Text
              variant="micro"
              className="absolute right-10 top-3 opacity-50"
            >
              ...
            </Text>
          )}

          {/* Résultats de la recherche */}
          {searchResults.length > 0 && (
            <ul className="absolute z-20 mt-2 w-full bg-[#111] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-white/5">
              {searchResults.map((player: Player) => (
                <li key={player.id}>
                  <PlayerSearchResultItem
                    player={player}
                    onClick={() => handleAdd(player)}
                    actionIcon={
                      <span className="text-[10px] uppercase font-bold text-black bg-gold px-2 py-1 rounded shadow">
                        Nommer
                      </span>
                    }
                    className="w-full text-left p-3 hover:bg-white/5 transition-colors border-none"
                  />
                </li>
              ))}
            </ul>
          )}

          {searchQuery.length >= 2 &&
            !isSearching &&
            searchResults.length === 0 && (
              <Text
                variant="micro"
                className="text-white/40 italic mt-2 px-1 block"
              >
                Aucun joueur disponible trouvé.
              </Text>
            )}
        </div>
      </div>
    </div>
  );
};
