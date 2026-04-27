import { useState } from 'react';

export const useActionRowInteraction = (action: any, onUpdate: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: action.description,
    points: action.points,
  });

  const handleSave = async (isAdmin: boolean) => {
    const success = await onUpdate(action.id, {
      description: editData.description,
      points: Number(editData.points),
      ...(isAdmin ? { status: 'validated' } : {}),
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
