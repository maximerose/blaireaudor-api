import { Text, Button, Input } from '@/components/UI';
import {
  SelectedPlayersList,
  PlayerSearchResultsDropdown,
} from '@/components/Competition';

interface RecruitmentStepProps {
  players: any;
  formData: any;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export const CompetitionRecruitmentStep = ({
  players,
  formData,
  onBack,
  onSubmit,
  loading,
}: RecruitmentStepProps) => {
  const searchTerm = players.searchTerm || '';
  const results = players.results || [];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <Text variant="h2" className="italic">
          Recrutement
        </Text>
      </div>

      <div className="relative">
        <Input
          autoFocus
          align="left"
          placeholder="Chercher ou créer un joueur..."
          value={searchTerm}
          onChange={(e: any) => {
            players.setSearchTerm(e.target.value);
            players.search(e.target.value);
          }}
          icon={players.searching ? '⏳' : '🔍'}
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
          variant="ghost"
          onClick={onBack}
          className="px-6 transition-default"
          size="md"
        >
          Précédent
        </Button>
        <Button
          onClick={onSubmit}
          isLoading={loading}
          size="md"
          className="flex-1"
        >
          Créer l'arène
        </Button>
      </div>
    </div>
  );
};
