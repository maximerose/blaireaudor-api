import {
  Badge,
  BADGE_VARIANT,
  PlayerSearchResultItem,
  Text,
  TEXT_VARIANT,
} from '@/components/UI';
import { COMPETITION_UI, FORM, ICONS, UI } from '@/constants';
import { useAuth, useCompetition, usePermissions } from '@/hooks';
import { useRefereeManagementUI } from '@/hooks/competition/useRefereeManagementUI';
import type { Player, RefereeListItem } from '@/types';

export const RefereeManagement = () => {
  const { competition } = useCompetition();
  const { user } = useAuth();
  const { roles } = usePermissions();

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
  } = useRefereeManagementUI(competition);

  return (
    <div className="space-y-4 pt-6 border-t border-white/10">
      <header>
        <Text variant={TEXT_VARIANT.H3}>
          {COMPETITION_UI.ADMIN.REFEREE.TITLE}
        </Text>
        <Text variant={TEXT_VARIANT.CAPTION} className="opacity-60 text-[10px]">
          {COMPETITION_UI.ADMIN.REFEREE.SUBTITLE}
        </Text>
      </header>

      {/* Liste des arbitres actuels */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {referees.map((ref: RefereeListItem) => {
          const isCreator = ref.userId === competition.created_by?.id;
          const isMe = user?.player?.id === ref.id;

          const variant = isCreator
            ? BADGE_VARIANT.CREATOR
            : isMe
              ? BADGE_VARIANT.ME
              : BADGE_VARIANT.REFEREE;
          const icon = isCreator ? ICONS.CREATOR : ICONS.REFEREE;

          const isRemoving = loadingAction === `remove-${ref.id}`;

          const canRemove = (!isLastRef && isMe) || (roles.isCreator && !isMe);

          return (
            <Badge
              key={ref.id}
              variant={variant}
              icon={icon}
              className={isRemoving ? 'opacity-50 pointer-events-none' : ''}
            >
              <span className="flex items-center gap-1">
                {ref.name}{' '}
                {isMe && <span className="opacity-70">({UI.ME})</span>}
              </span>

              {canRemove && (
                <button
                  onClick={() => handleRemoveRequest(ref, isMe)}
                  disabled={isRemoving}
                  className="hover:text-danger text-white/40 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors ml-1"
                  title={
                    isMe
                      ? COMPETITION_UI.ADMIN.REFEREE.TOOLTIP_RESIGN
                      : COMPETITION_UI.ADMIN.REFEREE.TOOLTIP_REVOKE
                  }
                  aria-label={COMPETITION_UI.ADMIN.REFEREE.ARIA_REVOKE}
                >
                  {ICONS.CANCEL}
                </button>
              )}
            </Badge>
          );
        })}
      </div>

      {isLastRef && (
        <Text
          variant={TEXT_VARIANT.MICRO}
          className="text-warning-bright/80 italic block"
        >
          {COMPETITION_UI.ADMIN.REFEREE.LAST_REF_WARNING}
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
              placeholder={FORM.PLAYER.PLACEHOLDERS.SEARCH_PLAYER}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-3 pr-10 text-sm text-white w-full focus:border-gold/50 outline-none transition-colors"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-1"
                aria-label="Effacer la recherche"
              >
                {ICONS.CANCEL}
              </button>
            )}
          </div>

          {isSearching && (
            <Text
              variant={TEXT_VARIANT.MICRO}
              className="absolute right-10 top-3 opacity-50"
            >
              {ICONS.LOADING}
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
                        {COMPETITION_UI.ADMIN.REFEREE.APPOINT}
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
                variant={TEXT_VARIANT.MICRO}
                className="text-white/40 italic mt-2 px-1 block"
              >
                {FORM.PLAYER.HINT.NOT_FOUND}
              </Text>
            )}
        </div>
      </div>
    </div>
  );
};
