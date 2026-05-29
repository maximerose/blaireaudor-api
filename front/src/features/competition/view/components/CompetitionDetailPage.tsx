import { COMPETITION_UI } from '@/features/competition/constants';
import { CompetitionProvider } from '@/features/competition/context';
import { useCompetitionData } from '@/features/competition/view/hooks';
import { ERRORS, LoadingScreen, MainLayout, NotFoundState } from '@/shared';
import { useParams } from 'react-router-dom';
import { CompetitionDetailContent } from './CompetitionDetailContent';

export const CompetitionDetailPage = () => {
  const { code: rawCode } = useParams<{ code: string }>();
  const code = rawCode?.toUpperCase();
  const { isLoading, isError, competition, leaderboard, refresh } =
    useCompetitionData(code || '');

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingScreen
          layout="fullscreen"
          message={COMPETITION_UI.DETAIL.LOADING}
        />
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
