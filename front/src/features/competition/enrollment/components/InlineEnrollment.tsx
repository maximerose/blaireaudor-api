import {
  Input,
  Button,
  Card,
  Text,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
  CARD_VARIANT,
  FORM,
  BUTTONS,
  ICONS,
  Row,
  Stack,
} from '@/shared';
import {
  PlayerSearchResultItem,
  type Player,
  type PlayerCompact,
} from '@/features/player';
import { useInlineEnrollmentUI } from '@/features/competition/enrollment/hooks';
import { SelectedPlayerBadge } from './SelectedPlayerBadge';

export const InlineEnrollment = () => {
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
  } = useInlineEnrollmentUI();

  if (!isOwner) return null;

  if (!isOpen) {
    return (
      <Button
        variant={BUTTON_VARIANT.GHOST}
        fullWidth
        onClick={() => setIsOpen(true)}
        className="border-dashed border-border-subtle py-4 mt-4 transition-default hover:bg-surface-base"
        aria-expanded="false"
      >
        {FORM.ADMIN.ENROLLMENT.BUTTON_OPEN}
      </Button>
    );
  }

  return (
    <Card
      variant={CARD_VARIANT.DARK}
      padding="md"
      className="mt-4 border-gold-border animate-slide-up relative overflow-visible"
      role="section"
      aria-label="Formulaire de recrutement"
    >
      <Stack gap="md" className="w-full">
        {/* CHAMP DE RECHERCHE */}
        <div className="relative w-full">
          <Stack gap="xs" className="w-full">
            <Input
              autoFocus
              align="center"
              label={FORM.PLAYER.LABELS.SEARCH_PLAYER}
              placeholder={FORM.PLAYER.LABELS.SEARCH_PLAYER}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={isSearching ? ICONS.LOADING : ICONS.SEARCH}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={searchResults.length > 0}
              aria-controls="search-results-list"
            />

            {canCreatePlayer && (
              <Button
                variant={BUTTON_VARIANT.SECONDARY}
                size={BUTTON_SIZE.SMALL}
                fullWidth
                onClick={() => addNewPlayer(searchTerm)}
                className="border-dashed border-border-base italic normal-case transition-default hover:border-gold-border"
                aria-label={FORM.ADMIN.ENROLLMENT.CREATE_NEW(searchTerm)}
              >
                <Text variant={TEXT_VARIANT.MICRO} className="opacity-100">
                  {FORM.ADMIN.ENROLLMENT.CREATE_NEW(searchTerm)}
                </Text>
              </Button>
            )}
          </Stack>

          {searchResults.length > 0 && (
            <Card
              id="search-results-list"
              role="listbox"
              variant={CARD_VARIANT.DARK}
              padding="none"
              radius="lg"
              className="absolute top-full left-0 right-0 mt-1 z-50 border-gold-border shadow-2xl bg-dark max-h-56 overflow-y-auto no-scrollbar"
            >
              {searchResults.map((p: Player) => (
                <PlayerSearchResultItem
                  key={p.id}
                  player={p}
                  role="option"
                  onClick={() => addExistingPlayer(p)}
                  actionIcon={BUTTONS.ADD}
                />
              ))}
            </Card>
          )}
        </div>

        {newPlayers.length > 0 && (
          <Row
            wrap
            gap="sm"
            className="py-3 border-t border-border-subtle"
            role="list"
            aria-label="Joueurs sélectionnés pour le recrutement"
          >
            {newPlayers.map((p: PlayerCompact) => (
              <SelectedPlayerBadge
                key={p.id}
                player={p}
                onRemove={removePlayer}
              />
            ))}
          </Row>
        )}

        <Row justify="between" gap="sm" mt="xs">
          <Button
            variant={BUTTON_VARIANT.GHOST_NEUTRAL}
            onClick={() => setIsOpen(false)}
            aria-label={BUTTONS.CANCEL}
            size={BUTTON_SIZE.SMALL}
          >
            {BUTTONS.CANCEL}
          </Button>
          <Button
            onClick={() => saveEnrollment()}
            isLoading={loading}
            disabled={newPlayers.length === 0}
            aria-live="polite"
            size={BUTTON_SIZE.SMALL}
            fullWidth
            className="flex-1"
          >
            {FORM.ADMIN.ENROLLMENT.SAVE_COUNT(newPlayers.length)}
          </Button>
        </Row>
      </Stack>
    </Card>
  );
};
