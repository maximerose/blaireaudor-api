import { MainLayout, LoadingScreen, NotFoundState, ERRORS } from '@/shared';
import {
  COMPETITION_UI,
  CompetitionDetailContent,
  CompetitionProvider,
  useCompetitionData,
} from '@/features/competition';
import { useParams } from 'react-router-dom';

export const CompetitionDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const { isLoading, isError, competition, leaderboard, refresh } =
    useCompetitionData(code || '');

  if (isLoading) {
    return (
      <MainLayout title={COMPETITION_UI.DETAIL.LOADING}>
        <LoadingScreen layout="local" message={COMPETITION_UI.DETAIL.LOADING} />
      </MainLayout>
    );
  }
  if (isError || !competition) {
    return (
      <MainLayout title={COMPETITION_UI.DETAIL.NOT_FOUND}>
        <NotFoundState
          title={COMPETITION_UI.DETAIL.NOT_FOUND}
          message={ERRORS.COMPETITION.NOT_FOUND(code ?? '')}
        />
      </MainLayout>
    );
  }

  return (
    <CompetitionProvider
      competition={competition}
      leaderboard={leaderboard}
      refresh={refresh}
    >
      <CompetitionDetailContent />
    </CompetitionProvider>
  );
};

export default CompetitionDetailPage;
