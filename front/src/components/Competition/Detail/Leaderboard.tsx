import { Card, EmptyState } from '@/components/UI';
import { LeaderboardRow } from '@/components/Competition';
import { useLeaderboardUI } from '@/hooks';

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
  const { enrichedData, isAdmin, handleDelete } = useLeaderboardUI(
    data,
    competition,
    onRefresh,
  );

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
            onDelete={() => handleDelete(item)}
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
