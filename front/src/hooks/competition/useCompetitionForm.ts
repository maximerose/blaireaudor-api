import type { CompetitionFormData } from '@/types';
import { useState } from 'react';

export const useCompetitionForm = (initialData: CompetitionFormData) => {
  const [formData, setFormData] = useState<CompetitionFormData>(initialData);

  const updateField = <K extends keyof CompetitionFormData>(
    field: K,
    value: CompetitionFormData[K],
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (
        field === 'startDate' &&
        updated.endDate &&
        updated.endDate < (value as string)
      ) {
        updated.endDate = '';
      }
      return updated;
    });
  };
  return {
    formData,
    setFormData,
    updateField,
  };
};
