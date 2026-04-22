import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useParticipationDelete } from '../../hooks/useParticipationDelete';
import { useLeaderboardLogic } from '../../hooks/useLeaderboardLogic';
import { ROUTES } from '../../constants/routes';
import { Card } from '../UI/Card';
import { LeaderboardRow } from './LeaderboardRow';
import { canManageCompetition } from '../../utils/permissions';

interface LeaderboardProps {
  data: any[];
  competition: any;
  onRefresh: () => void;
}

export const Leaderboard = ({
  data,
  competition,
  onRefresh,
}: LeaderboardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = canManageCompetition(user, competition);
  const { deleteParticipation } = useParticipationDelete(onRefresh);

  const enrichedData = useLeaderboardLogic(data, user);

  return (
    <Card variant="dark" className="overflow-hidden shadow-2xl">
      <div className="divide-y divide-white/5">
        {enrichedData.map((item) => (
          <LeaderboardRow
            key={item.id}
            item={item}
            isAdmin={isAdmin}
            onDelete={async () => {
              const success = await deleteParticipation(
                item.id,
                item.player.display_name || item.player.displayName,
                false,
              );
              if (success && item.isMe) {
                navigate(ROUTES.NAV_DASHBOARD);
              }
            }}
          />
        ))}
      </div>

      {enrichedData.length === 0 && (
        <div className="p-10 text-center text-white/20 text-xs italic">
          Aucun joueur dans cette arène.
        </div>
      )}
    </Card>
  );
};
