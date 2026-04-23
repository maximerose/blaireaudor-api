import { useNavigate } from 'react-router-dom';
import { CreateCompetitionView } from '../components/CreateCompetition/CreateCompetitionView';
import { ROUTES } from '../constants/routes';
import { Card } from '../components/UI/Card';

export const CreateCompetitionPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (competition: any) => {
    navigate(ROUTES.NAV_COMPETITION_DETAIL(competition.join_code));
  };

  return (
    <main
      className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in motion-reduce:animate-none"
      aria-label="Création d'une nouvelle arène"
    >
      <Card
        variant="glass"
        className="w-full max-w-md p-8 rounded-[2.5rem] border-white/5 shadow-2xl"
      >
        <CreateCompetitionView onSuccess={handleSuccess} />
      </Card>
    </main>
  );
};
