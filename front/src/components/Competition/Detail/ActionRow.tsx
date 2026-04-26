import { useState } from 'react';
import { cn, formatShortDate } from '@/utils';
import { Badge, Text, Input, Button } from '@/components/UI';
import { useActionRow } from '@/hooks';

export const ActionRow = ({
  action,
  isAdmin,
  hidePoints,
  onUpdate,
  onStatusChange,
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: action.description,
    points: action.points,
  });

  const { isPending, pointsDisplay, pointsColorClass, playerName } =
    useActionRow(action);

  const displayPoints = hidePoints ? '??' : pointsDisplay;
  const displayColor = hidePoints ? 'text-white/20' : pointsColorClass;

  const handleSave = async () => {
    const success = await onUpdate(action.id, {
      description: editData.description,
      points: Number(editData.points),
      ...(isAdmin ? { status: 'validated' } : {}),
    });
    if (success) setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-6 bg-gold/10 border-y border-gold/20 animate-fade-in space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-9">
            <Input
              label="Description"
              value={editData.description}
              onChange={(e: any) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-3">
            <Input
              label="Points"
              type="number"
              value={editData.points}
              onChange={(e: any) =>
                setEditData({ ...editData, points: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
            Annuler
          </Button>
          <Button size="sm" variant="primary" onClick={handleSave}>
            Enregistrer 💾
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/2 transition-default group relative',
        hidePoints && 'opacity-80',
      )}
    >
      <div className="col-span-3 md:col-span-2">
        <Text variant="mono" className="text-[10px] text-white/40">
          {formatShortDate(action.date_action)}
        </Text>
      </div>

      <div className="col-span-6 md:col-span-8 flex flex-col items-center md:items-start md:grid md:grid-cols-8 overflow-hidden">
        <Text
          variant="h3"
          className="md:col-span-3 truncate italic text-xs group-hover:text-gold transition-default"
        >
          {playerName}
        </Text>

        <div className="md:col-span-5 w-full flex flex-col items-center md:items-start">
          <Text
            variant="body"
            className="text-[10px] md:text-xs text-white italic"
            title={action.description}
          >
            "{action.description}"
          </Text>
          <Text
            variant="body"
            className="text-[8px] md:text-[10px] italic px-2 py-0 text-white/50"
            title={action.creator_name}
          >
            Dénoncé par :{' '}
            <span className="text-info-bright">{action.creator_name}</span>
          </Text>

          {/* LE BADGE + ACTIONS (Sous la description) */}
          {isPending && (
            <div className="mt-2 flex flex-col sm:flex-row items-center gap-3">
              {!isAdmin && (
                <Badge
                  variant="warning"
                  isPulse
                  className="text-[8px] px-2 py-0"
                >
                  En attente
                </Badge>
              )}

              {isAdmin && (
                <div className="flex gap-4 animate-fade-in sm:border-l sm:border-white/10 sm:pl-3">
                  <button
                    onClick={() => onStatusChange(action.id, 'validated')}
                    className="text-[10px] font-black text-success hover:underline uppercase tracking-widest"
                  >
                    Accepter ✓
                  </button>
                  <button
                    onClick={() => onStatusChange(action.id, 'rejected')}
                    className="text-[10px] font-black text-danger hover:underline uppercase tracking-widest"
                  >
                    Refuser ✕
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="col-span-3 md:col-span-2 text-right">
        <Text
          variant="mono"
          className={cn('text-sm md:text-base font-black', displayColor)}
        >
          {displayPoints}{' '}
          <span className="text-[8px] opacity-50 uppercase">pts</span>
        </Text>
      </div>

      {isPending && isAdmin && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute right-2 top-2 group-hover:opacity-30 hover:opacity-100 transition-default p-1"
        >
          ✏️
        </button>
      )}
    </div>
  );
};
