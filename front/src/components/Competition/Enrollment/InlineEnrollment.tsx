import {
  Input,
  Button,
  Card,
  PlayerSearchResultItem,
  Text,
} from '@/components/UI';
import { useInlineEnrollmentUI } from '@/hooks';
import { SelectedPlayerBadge } from '@/components/Competition';
import { FORM, BUTTONS, ICONS } from '@/constants';
import type React from 'react';

interface InlineEnrollmentProps {
  onRefresh: () => void;
}

export const InlineEnrollment = ({ onRefresh }: InlineEnrollmentProps) => {
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
  } = useInlineEnrollmentUI(onRefresh);

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
        {FORM.ADMIN.ENROLLMENT.BUTTON_OPEN}
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
          {FORM.ADMIN.ENROLLMENT.TITLE}
        </Text>
      </div>

      <div className="relative mb-4 space-y-2">
        <Input
          autoFocus
          align="center"
          label={FORM.PLAYER.LABELS.SEARCH_PLAYER}
          placeholder={FORM.PLAYER.LABELS.SEARCH_PLAYER}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={isSearching ? ICONS.LOADING : ICONS.SEARCH}
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
                onClick={() => addExistingPlayer(p)}
                actionIcon={BUTTONS.ADD}
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
            aria-label={FORM.ADMIN.ENROLLMENT.CREATE_NEW(searchTerm)}
          >
            <Text variant="micro" className="opacity-100">
              {FORM.ADMIN.ENROLLMENT.CREATE_NEW(searchTerm)}
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
          onClick={() => saveEnrollment()}
          isLoading={loading}
          disabled={newPlayers.length === 0}
          aria-live="polite"
        >
          {FORM.ADMIN.ENROLLMENT.SAVE_COUNT(newPlayers.length)}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(false)}
          className="px-4 transition-default shrink-0"
          aria-label={BUTTONS.CANCEL}
        >
          {BUTTONS.CANCEL}
        </Button>
      </div>
    </Card>
  );
};
