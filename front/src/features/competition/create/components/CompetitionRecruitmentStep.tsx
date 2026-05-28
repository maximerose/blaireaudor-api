import {
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  FORM,
  BUTTONS,
  Stack,
  Row,
  ICONS,
} from '@/shared';
import type { Player, PlayerCompact } from '@/features/player';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateCompetitionFormData } from '@/features/competition/validations';
import { SelectedPlayersList } from '@/features/competition/enrollment';
import { PlayerSearchField } from '../../fields';

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
    <Stack gap="xl" className="animate-slide-up w-full">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.TITLE}
        as="h1"
        title={FORM.COMPETITION.STEPS.RECRUITMENT.TITLE}
        subtitle={FORM.COMPETITION.STEPS.RECRUITMENT.SUBTITLE}
        centered
      />

      <Stack gap="sm" className="w-full">
        <PlayerSearchField
          searchTerm={searchTerm}
          setSearchTerm={players.setSearchTerm}
          isSearching={players.searching}
          results={results}
          onSelect={(p) => {
            players.add(p);
            players.setSearchTerm('');
          }}
          onCreateNew={(name) => {
            players.addNew(name);
            players.setSearchTerm('');
          }}
        />

        <SelectedPlayersList
          participants={currentPlayers}
          onRemove={(id) => players.remove(id)}
        />
      </Stack>

      <Row gap="sm" className="w-full pt-4">
        <Button
          variant={BUTTON_VARIANT.GHOST}
          onClick={onBack}
          size={BUTTON_SIZE.MEDIUM}
          icon={ICONS.ARROW_BIG_LEFT}
          iconPosition="left"
        >
          {BUTTONS.PREVIOUS}
        </Button>
        <Button
          onClick={onNext}
          size={BUTTON_SIZE.MEDIUM}
          fullWidth
          className="flex-1"
          icon={ICONS.ARROW_BIG_RIGHT}
          iconPosition="right"
        >
          {BUTTONS.CONTINUE}
        </Button>
      </Row>
    </Stack>
  );
};
