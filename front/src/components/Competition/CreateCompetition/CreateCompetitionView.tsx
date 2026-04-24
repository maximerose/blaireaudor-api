import { useCreateCompetitionForm } from '@/hooks';
import {
  CreateCompetitionStepper,
  CompetitionConfigStep,
  CompetitionRecruitmentStep,
} from '@/components/Competition';

interface Props {
  onSuccess: (_competition: any) => void;
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
    players,
    submit,
    loading,
  } = useCreateCompetitionForm(onSuccess);

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in space-y-8">
      <CreateCompetitionStepper step={step} />

      {step === 1 ? (
        <CompetitionConfigStep
          formData={formData}
          updateField={updateField}
          handleJoinCodeChange={handleJoinCodeChange}
          onGenerateCode={generateCode}
          canNext={canGoNext}
          onNext={() => setStep(2)}
        />
      ) : (
        <CompetitionRecruitmentStep
          players={players}
          formData={formData}
          onBack={() => setStep(1)}
          onSubmit={submit}
          loading={loading}
        />
      )}
    </div>
  );
};
