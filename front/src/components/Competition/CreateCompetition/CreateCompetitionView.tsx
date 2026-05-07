import { useCreateCompetitionForm } from '@/hooks';
import {
  CreateCompetitionStepper,
  CompetitionConfigStep,
  CompetitionRecruitmentStep,
} from '@/components/Competition';
import { CompetitionRefereeStep } from './CompetitionRefereeStep';
import type { Competition } from '@/types';

interface Props {
  onSuccess: (competition: Competition) => void;
}

export const CreateCompetitionView = ({ onSuccess }: Props) => {
  const {
    step,
    setStep,
    formData,
    updateField,
    handleJoinCodeChange,
    generateCode,
    canGoNext,
    searchState,
    playersActions,
    refereesActions,
    submit,
    loading,
  } = useCreateCompetitionForm(onSuccess);

  return (
    <div className="w-full animate-fade-in space-y-8">
      <CreateCompetitionStepper step={step} />

      {step === 1 && (
        <CompetitionConfigStep
          formData={formData}
          updateField={updateField}
          handleJoinCodeChange={handleJoinCodeChange}
          onGenerateCode={generateCode}
          canNext={canGoNext}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <CompetitionRecruitmentStep
          players={{ ...searchState, ...playersActions }}
          formData={formData}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <CompetitionRefereeStep
          searchState={searchState}
          formData={formData}
          onToggleReferee={refereesActions.toggle}
          onBack={() => setStep(2)}
          onSubmit={submit}
          loading={loading}
          updateField={updateField}
        />
      )}
    </div>
  );
};
