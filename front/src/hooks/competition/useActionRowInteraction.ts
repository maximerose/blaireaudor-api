import { LOG_MESSAGES } from '@/constants';
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
  const [editData, setEditData] = useState<ActionEditData>({
    description: action.description,
    points: action.points,
  });

  const handleSave = async (isAdmin: boolean): Promise<boolean> => {
    const payload = {
      description: editData.description,
      points: Number(editData.points),
      ...(isAdmin ? { status: ActionStatus.VALIDATED } : {}),
    };

    try {
      onUpdate(action.id, payload);
      return true;
    } catch (error) {
      console.error(LOG_MESSAGES.ACTION.UPDATE_FAILED, error);
      return false;
    }
  };

  return {
    editData,
    setEditData,
    handleSave,
  };
};
