import {
  ActionRowEditMode,
  ActionRowDisplayMode,
} from '@/components/Competition';
import type { Action } from '@/types';
import { useState } from 'react';

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
