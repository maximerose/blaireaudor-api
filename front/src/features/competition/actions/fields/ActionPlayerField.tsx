import React from 'react';
import { Input, ICONS, FORM } from '@/shared';
import { PlayerDropdownList } from '@/features/competition/enrollment';
import type { PlayerCompact } from '@/features/player';

interface ActionPlayerFieldProps {
  search: string;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  filteredPlayers: PlayerCompact[];
  selectPlayer: (id: string, name: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export const ActionPlayerField = ({
  search,
  showDropdown,
  setShowDropdown,
  searchContainerRef,
  filteredPlayers,
  selectPlayer,
  handleSearchChange,
  error,
  disabled = false,
}: ActionPlayerFieldProps) => {
  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <Input
        label={FORM.REPORT_ACTION.LABELS.PLAYER}
        placeholder={FORM.REPORT_ACTION.PLACEHOLDERS.PLAYER}
        value={search}
        required
        disabled={disabled}
        autoComplete="off"
        onFocus={() => setShowDropdown(true)}
        onChange={handleSearchChange}
        icon={showDropdown ? ICONS.SEARCH : ICONS.PLAYER}
        error={error}
      />
      {showDropdown && (
        <PlayerDropdownList
          filteredPlayers={filteredPlayers}
          selectPlayer={selectPlayer}
        />
      )}
    </div>
  );
};
