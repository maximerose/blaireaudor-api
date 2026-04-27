import { useActionRow, useActionRowInteraction } from '@/hooks';
import { ActionRowEditMode } from './ActionRowEditMode';
import { ActionRowDisplayMode } from './ActionRowDisplayMode';

export const ActionRow = ({
  action,
  isAdmin,
  hidePoints,
  onUpdate,
  onStatusChange,
}: any) => {
  const { isPending, pointsDisplay, pointsColorClass, playerName } =
    useActionRow(action);
  const {
    isEditing,
    editData,
    setEditData,
    startEditing,
    stopEditing,
    handleSave,
  } = useActionRowInteraction(action, onUpdate);

  const displayPoints = hidePoints ? '??' : pointsDisplay;
  const displayColor = hidePoints ? 'text-white/20' : pointsColorClass;

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
      displayPoints={displayPoints}
      displayColor={displayColor}
      isPending={isPending}
      isAdmin={isAdmin}
      hidePoints={hidePoints}
      onEdit={startEditing}
      onStatusChange={onStatusChange}
    />
  );
};
