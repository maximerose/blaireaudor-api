import { useState } from 'react';
import { CreateCompetitionView } from '../components/CreateCompetition/CreateCompetitionView';
import { PlayerEnrollmentView } from '../components/CreateCompetition/PlayerEnrollmentView';
// Importe ton futur composant de recrutement ici
// import { PlayerEnrollmentView } from '../components/CreateCompetition/PlayerEnrollmentView';

export const CreateCompetitionPage = () => {
  const [createdCompetition, setCreatedCompetition] = useState<any>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/40 border border-gold/20 p-8 rounded-3xl backdrop-blur-md">
        {!createdCompetition ? (
          <CreateCompetitionView
            onSuccess={(comp) => setCreatedCompetition(comp)}
          />
        ) : (
          <PlayerEnrollmentView competition={createdCompetition} />
        )}
      </div>
    </div>
  );
};
