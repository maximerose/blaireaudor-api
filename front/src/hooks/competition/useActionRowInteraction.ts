import {
  ActionStatus,
  type Action,
  type ActionEditData,
  type OnActionUpdate,
} from '@/types';
import { useState } from 'react';

export const useActionRowInteraction = (
  action: Action,
  onUpdate: OnActionUpdate,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ActionEditData>({
    description: action.description,
    points: action.points,
  });

  const handleSave = async (isAdmin: boolean) => {
    const payload = {
      description: editData.description,
      points: Number(editData.points),
      ...(isAdmin ? { status: ActionStatus.VALIDATED } : {}),
    };

    await onUpdate(action.id, payload);

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
