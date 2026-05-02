import { useActionRow, useActionRowInteraction, useCompetition } from '@/hooks';
import { ActionRowEditMode } from './ActionRowEditMode';
import { ActionRowDisplayMode } from './ActionRowDisplayMode';

export const ActionRow = ({ action, onUpdate, onStatusChange }: any) => {
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
