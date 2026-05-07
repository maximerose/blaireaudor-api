import { ActionStatus, type Action, type ActionEditData } from '@/types';
import { useState } from 'react';

export const useActionRowInteraction = (
  action: Action,
  onUpdate: (action: Action) => void,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ActionEditData>({
    description: action.description,
    points: action.points, // Sera converti en string/number selon l'input
  });

  const handleSave = async (isAdmin: boolean) => {
    const updatedAction: Action = {
      ...action,
      description: editData.description,
      points: Number(editData.points),
      ...(isAdmin ? { status: ActionStatus.VALIDATED } : {}),
    };

    await onUpdate(updatedAction);
    setIsEditing(false);
  };

  return {
    isEditing,
    editData,
    setEditData,
    startEditing: () => setIsEditing(true),
    stopEditing: () => setIsEditing(false),
    handleSave,
  };
};
