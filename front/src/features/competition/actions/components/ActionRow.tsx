import { useState } from 'react';
import type { Action } from '@/features/competition/types';
import { ActionRowEditMode } from './ActionRowEditMode';
import { ActionRowDisplayMode } from './ActionRowDisplayMode';

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
