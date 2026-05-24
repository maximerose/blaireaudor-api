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
  cn,
} from '@/shared';
import { type PlayerCompact } from '@/features/player';
import { useInlineEnrollmentUI } from '@/features/competition/enrollment/hooks';
import { SelectedPlayerBadge } from './SelectedPlayerBadge';
import { PlayerSearchField } from '@/features/competition/fields';

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

  return (
    <div className="w-full mt-2">
      {/* Wrapper du Bouton d'ouverture */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden',
          isOpen
            ? 'max-h-0 opacity-0 pointer-events-none mb-0'
            : 'max-h-20 opacity-100 mb-2',
        )}
      >
        <Button
          variant={BUTTON_VARIANT.GHOST}
          fullWidth
          onClick={() => setIsOpen(true)}
          className="border-dashed border-border-subtle py-4 transition-default hover:bg-surface-base"
          aria-expanded="false"
        >
          {FORM.ADMIN.ENROLLMENT.BUTTON_OPEN}
        </Button>
      </div>

      {/* Wrapper du Formulaire */}
      <div
        className={cn(
          'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
          isOpen
            ? 'max-h-150 opacity-100 overflow-hidden scale-100'
            : 'max-h-0 opacity-0 pointer-events-none overflow-hidden scale-95',
        )}
      >
        <Card
          variant={CARD_VARIANT.DARK}
          padding="md"
          className="border-gold-border relative"
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
              variant="inline"
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
      </div>
    </div>
  );
};
