import { useActionRow, useActionRowInteraction, useCompetition } from '@/hooks';
import {
  ActionRowEditMode,
  ActionRowDisplayMode,
} from '@/components/Competition';
import type { ActionRowProps } from '@/types';

export const ActionRow = ({
  action,
  onUpdate,
  onStatusChange,
}: ActionRowProps) => {
  const { isPending, playerName } = useActionRow(action);
  const { isAdmin } = useCompetition();

  const {
    isEditing,
    editData,
    setEditData,
    startEditing,
    stopEditing,
    handleSave,
  } = useActionRowInteraction(action, onUpdate);

  if (isEditing) {
    return (
      <ActionRowEditMode
        editData={editData}
        setEditData={setEditData}
        onSave={() => handleSave(isAdmin)}
        onCancel={stopEditing}
      />
    );
  }

  return (
    <ActionRowDisplayMode
      action={action}
      playerName={playerName}
      isPending={isPending}
      onEdit={startEditing}
      onStatusChange={onStatusChange}
    />
  );
};
