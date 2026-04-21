import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useParticipationDelete } from '../../hooks/useParticipationDelete';
import {
  useLeaderboardLogic,
  type EnrichedLeaderboardItem,
} from '../../hooks/useLeaderboardLogic';
import { ROUTES } from '../../constants/routes';
import { Badge } from '../UI/Badge';
import { RankedScore } from '../UI/RankedScore';
import { getMedalStyle } from '../../utils/rankStyles';

interface LeaderboardProps {
  data: any[];
  onRefresh: () => void;
}

export const Leaderboard = ({ data, onRefresh }: LeaderboardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteParticipation } = useParticipationDelete(onRefresh);

  const enrichedData = useLeaderboardLogic(data, user);

  return (
    <div className="bg-black/20 border border-gold/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="divide-y divide-white/5">
        {enrichedData.map((item: EnrichedLeaderboardItem) => (
          <LeaderboardRow
            key={item.id}
            item={item}
            onDelete={async () => {
              await deleteParticipation(
                item.id,
                item.player.display_name,
                false,
              );
              if (item.isMe) navigate(ROUTES.NAV_DASHBOARD);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const LeaderboardRow = ({
  item,
  onDelete,
}: {
  item: EnrichedLeaderboardItem;
  onDelete: () => void;
}) => {
  const canDelete = item.actions.length === 0;

  return (
    <div
      className={`grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-colors group ${
        item.rank <= 3 ? 'bg-white/2' : ''
      }`}
    >
      <div className="col-span-2 flex justify-center">
        {item.medal ? (
          <span className={getMedalStyle(item.rank)} title={item.medal.label}>
            {item.medal.icon}
          </span>
        ) : (
          <Badge variant="ghost" className="opacity-40">
            {item.rank}
          </Badge>
        )}
      </div>

      <div className="col-span-7 flex items-center justify-between pr-2">
        <div className="flex flex-col gap-0.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-sm truncate ${item.isMe ? 'text-gold' : 'text-white'}`}
            >
              {item.player.display_name}
            </span>
            {item.isMe && <Badge variant="gold">Moi</Badge>}
          </div>
          {item.isExAequo && (
            <span className="text-[8px] text-white/20 uppercase font-bold text-left">
              Ex-æquo
            </span>
          )}
        </div>

        {canDelete && (
          <button
            onClick={onDelete}
            className="ml-2 p-2 text-red-500/20 active:text-red-500 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        )}
      </div>

      <div className="col-span-3 flex items-baseline justify-end gap-1 font-mono font-bold">
        <RankedScore score={item.score} rank={item.rank} />
      </div>
    </div>
  );
};
