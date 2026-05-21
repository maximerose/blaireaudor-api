import { useState } from 'react';
import {
  ActionRowDisplayMode,
  ActionRowEditMode,
  type Action,
} from '@/features/competition';

export const ActionRow = ({ action }: { action: Action }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ActionRowEditMode action={action} onCancel={() => setIsEditing(false)} />
    );
  }

  return (
    <ActionRowDisplayMode action={action} onEdit={() => setIsEditing(true)} />
  );
};
