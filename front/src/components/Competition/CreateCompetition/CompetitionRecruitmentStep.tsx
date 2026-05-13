import {
  Text,
  Button,
  Input,
  BUTTON_VARIANT,
  BUTTON_SIZE,
} from '@/components/UI';
import {
  SelectedPlayersList,
  PlayerSearchResultsDropdown,
} from '@/components/Competition';
import { FORM, ICONS, BUTTONS } from '@/constants';
import type { CompetitionFormData, Player, PlayerCompact } from '@/types';

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
  players: PlayerManagement;
  formData: CompetitionFormData;
  onBack: () => void;
  onNext: () => void;
}

export const CompetitionRecruitmentStep = ({
  players,
  formData,
  onBack,
  onNext,
}: RecruitmentStepProps) => {
  const searchTerm = players.searchTerm || '';
  const results = players.results || [];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <Text variant="h2" className="italic">
          {FORM.COMPETITION.STEPS.RECRUITMENT.TITLE}
        </Text>
        <Text variant="caption" className="opacity-30">
          {FORM.COMPETITION.STEPS.RECRUITMENT.SUBTITLE}
        </Text>
      </div>

      <div className="relative">
        <Input
          autoFocus
          align="center"
          placeholder={FORM.PLAYER.PLACEHOLDERS.SEARCH_OR_CREATE}
          value={searchTerm}
          onChange={(e) => {
            players.setSearchTerm(e.target.value);
          }}
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
        participants={formData.players || []}
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
