import type { UpdatePreferencesData } from '@/features/account/validations';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export const useNotificationSettings = (
  form: UseFormReturn<UpdatePreferencesData>,
) => {
  const {
    watch,
    setValue,
    formState: { isSubmitting, isDirty },
  } = form;

  const preferences: Record<string, boolean> =
    watch('notification_preferences') ?? {};

  const [expandedHints, setExpandedHints] = useState<Record<string, boolean>>(
    {},
  );

  const toggleHint = (id: string) => {
    setExpandedHints((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggle = (id: string) => {
    const currentValue = preferences[id] ?? true;

    setValue(
      'notification_preferences',
      {
        ...preferences,
        [id]: !currentValue,
      },
      { shouldDirty: true },
    );
  };

  return {
    preferences,
    isSubmitting,
    isDirty,
    expandedHints,
    toggleHint,
    handleToggle,
  };
};
