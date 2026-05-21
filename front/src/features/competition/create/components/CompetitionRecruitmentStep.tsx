import {
  Button,
  Input,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  FORM,
  ICONS,
  BUTTONS,
} from '@/shared';
import type { Player, PlayerCompact } from '@/features/player';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateCompetitionFormData } from '@/features/competition/validations';
import {
  PlayerSearchResultsDropdown,
  SelectedPlayersList,
} from '@/features/competition/enrollment';

interface PlayerManagement {
  searchTerm: string;
  results: PlayerCompact[];
  setSearchTerm: (term: string) => void;
  searching: boolean;
  add: (player: Player | PlayerCompact) => void;
  addNew: (name: string) => void;
  remove: (id: string) => void;
}

interface RecruitmentStepProps {
  formMethods: UseFormReturn<CreateCompetitionFormData>;
  players: PlayerManagement;
  onBack: () => void;
  onNext: () => void;
}

export const CompetitionRecruitmentStep = ({
  formMethods,
  players,
  onBack,
  onNext,
}: RecruitmentStepProps) => {
  const searchTerm = players.searchTerm || '';
  const currentPlayers = formMethods.watch('players');
  const results = (players.results || []).filter(
    (result) => !currentPlayers.some((p) => String(p.id) === String(result.id)),
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.TITLE}
        as="h1"
        title={FORM.COMPETITION.STEPS.RECRUITMENT.TITLE}
        subtitle={FORM.COMPETITION.STEPS.RECRUITMENT.SUBTITLE}
        centered
      />

      <div className="relative">
        <Input
          autoFocus
          align="center"
          placeholder={FORM.PLAYER.PLACEHOLDERS.SEARCH_OR_CREATE}
          value={searchTerm}
          onChange={(e) => players.setSearchTerm(e.target.value)}
          icon={players.searching ? ICONS.LOADING : ICONS.SEARCH}
        />

        {searchTerm.length >= 1 && (
          <PlayerSearchResultsDropdown
            results={results}
            searchTerm={searchTerm}
            onSelect={(p) => {
              players.add(p);
              players.setSearchTerm('');
            }}
            onCreateNew={(name) => {
              players.addNew(name);
              players.setSearchTerm('');
            }}
          />
        )}
      </div>

      <SelectedPlayersList
        participants={currentPlayers}
        onRemove={(id) => players.remove(id)}
      />

      <div className="flex gap-2">
        <Button
          variant={BUTTON_VARIANT.GHOST}
          onClick={onBack}
          className="px-6"
          size={BUTTON_SIZE.MEDIUM}
        >
          {BUTTONS.PREVIOUS}
        </Button>
        <Button onClick={onNext} size={BUTTON_SIZE.MEDIUM} className="flex-1">
          {BUTTONS.CONTINUE}
        </Button>
      </div>
    </div>
  );
};
