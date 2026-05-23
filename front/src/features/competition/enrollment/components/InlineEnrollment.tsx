import {
  Button,
  Card,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  CARD_VARIANT,
  FORM,
  BUTTONS,
  Row,
  Stack,
} from '@/shared';
import { type PlayerCompact } from '@/features/player';
import { useInlineEnrollmentUI } from '@/features/competition/enrollment/hooks';
import { SelectedPlayerBadge } from './SelectedPlayerBadge';
import { PlayerSearchField } from '../../fields';

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
        <PlayerSearchField
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSearching={isSearching}
          results={searchResults}
          onSelect={addExistingPlayer}
          onCreateNew={canCreatePlayer ? addNewPlayer : undefined}
          placeholder={FORM.PLAYER.LABELS.SEARCH_PLAYER}
        />

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
