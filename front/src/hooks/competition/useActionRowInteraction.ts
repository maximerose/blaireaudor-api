import { ActionStatus, type Action } from '@/types';
import { useState } from 'react';

export const useActionRowInteraction = (action: Action, onUpdate: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: action.description,
    points: action.points,
  });

  const handleSave = async (isAdmin: boolean) => {
    const success = await onUpdate(action.id, {
      description: editData.description,
      points: Number(editData.points),
      ...(isAdmin ? { status: ActionStatus.VALIDATED } : {}),
    });
    if (success) setIsEditing(false);
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
