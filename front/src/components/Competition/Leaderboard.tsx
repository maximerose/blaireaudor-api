// front/src/components/Competition/Leaderboard.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useParticipationDelete } from '../../hooks/useParticipationDelete';
import {
  useLeaderboardLogic,
  type EnrichedLeaderboardItem,
} from '../../hooks/useLeaderboardLogic';
import { ROUTES } from '../../constants/routes';

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
              if (item.isMe) navigate(ROUTES.DASHBOARD);
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
          <span className="text-xl" title={item.medal.label}>
            {item.medal.icon}
          </span>
        ) : (
          <span className="font-black text-gold/40 text-xs">{item.rank}</span>
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
            {item.isMe && (
              <span className="text-[7px] bg-gold text-dark px-1 py-0.5 rounded font-black uppercase tracking-tighter">
                Moi
              </span>
            )}
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
        <span
          className={`text-sm md:text-base ${item.medal ? 'text-white' : 'text-gold/80'}`}
        >
          {item.score}
        </span>
        <span className="text-[8px] md:text-[10px] opacity-30 uppercase tracking-tighter text-white">
          pts
        </span>
      </div>
    </div>
  );
};
