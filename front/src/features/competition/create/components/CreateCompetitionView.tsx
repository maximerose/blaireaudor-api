import type { Competition } from '@/features/competition/types';
import { useCreateCompetitionForm } from '@/features/competition/create/hooks';
import { CreateCompetitionStepper } from './CreateCompetitionStepper';
import { CompetitionConfigStep } from './CompetitionConfigStep';
import { CompetitionRecruitmentStep } from './CompetitionRecruitmentStep';
import { CompetitionRefereeStep } from './CompetitionRefereeStep';
import { Stack } from '@/shared';

interface Props {
  onSuccess: (competition: Competition) => void;
}

export const CreateCompetitionView = ({ onSuccess }: Props) => {
  const {
    step,
    setStep,
    handleNextStep1,
    formMethods,
    searchState,
    playersActions,
    refereesActions,
    submit,
    loading,
  } = useCreateCompetitionForm(onSuccess);

  return (
    <form onSubmit={submit} className="w-full animate-fade-in" noValidate>
      <Stack gap="xl" className="w-full">
        <CreateCompetitionStepper step={step} />

        {step === 1 && (
          <CompetitionConfigStep
            formMethods={formMethods}
            onNext={handleNextStep1}
          />
        )}
        {step === 2 && (
          <CompetitionRecruitmentStep
            formMethods={formMethods}
            players={{ ...searchState, ...playersActions }}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <CompetitionRefereeStep
            formMethods={formMethods}
            searchState={searchState}
            onToggleReferee={refereesActions.toggle}
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}
      </Stack>
    </form>
  );
};
