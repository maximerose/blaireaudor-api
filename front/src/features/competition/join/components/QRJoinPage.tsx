import { LoadingScreen } from '@/shared';
import { useQRJoin } from '@/features/competition/join/hooks';
import { COMPETITION_UI } from '../../constants';
export const QRJoinPage = () => {
  useQRJoin();

  return <LoadingScreen message={COMPETITION_UI.REDIRECT} />;
};
