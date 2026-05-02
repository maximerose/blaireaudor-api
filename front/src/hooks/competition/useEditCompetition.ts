import { useState } from 'react';
import { apiFetch } from '@/services/api/config';
import { toast } from 'react-hot-toast';
import { ROUTES } from '@/constants/routes';
import { formatToApiISO, parseFromApiISO } from '@/utils';
import { useNavigate } from 'react-router-dom';

export const useEditCompetition = (competition: any, onRefresh: () => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const start = parseFromApiISO(competition.start_date);
  const end = parseFromApiISO(competition.end_date);

  const [formData, setFormData] = useState({
    name: competition.name,
    joinCode: competition.join_code,
    startDate: start.date,
    startTime: start.time,
    startFullDay: start.time === '00:00',
    endDate: end.date,
    endTime: end.time,
    endFullDay: end.time === '23:59' || end.time === '00:00',
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    const finalStart = formatToApiISO(
      formData.startDate,
      formData.startTime,
      formData.startFullDay,
      false,
    );
    const finalEnd = formatToApiISO(
      formData.endDate,
      formData.endTime,
      formData.endFullDay,
      true,
    );

    try {
      const response = await apiFetch(
        ROUTES.API_COMPETITION_DETAIL(competition.id),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/merge-patch+json' },
          body: JSON.stringify({
            name: formData.name,
            join_code: formData.joinCode,
            ...(!competition.has_started && { start_date: finalStart }),
            end_date: finalEnd,
          }),
        },
      );

      if (!response.ok) throw new Error();

      toast.success('Configuration mise à jour !');
      setIsEditing(false);

      const hasCodeChanged = formData.joinCode !== competition.join_code;

      if (hasCodeChanged) {
        navigate(ROUTES.NAV_COMPETITION_DETAIL(formData.joinCode), {
          replace: true,
        });
      } else {
        onRefresh();
      }
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    formData,
    updateField,
    handleSave,
    loading,
  };
};
