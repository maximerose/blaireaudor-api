import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useParticipationDelete } from '../../hooks/useParticipationDelete';
import { useLeaderboardLogic } from '../../hooks/useLeaderboardLogic';
import { ROUTES } from '../../constants/routes';
import { Card } from '../UI/Card';
import { LeaderboardRow } from './LeaderboardRow';
import { canManageCompetition } from '../../utils/permissions';
import { EmptyState } from '../UI/EmptyState';

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
    <Card
      variant="dark"
      className="overflow-hidden shadow-2xl border-white/5"
      role="region"
      aria-label={`Classement de la compétition : ${competition?.name || 'en cours'}`}
    >
      <div className="divide-y divide-white/5" role="list">
        {enrichedData.map((item) => (
          <LeaderboardRow
            key={item.id}
            item={item}
            isAdmin={isAdmin}
            role="listitem"
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
        <EmptyState
          layout="card"
          icon="🏜️"
          title="No man's land"
          message="L'arène est déserte... Aucun blaireau n'a osé relever le défi pour le moment."
          role="status"
        />
      )}
    </Card>
  );
};
