import { useState } from 'react';
import { apiFetch } from '../api/config';
import { ROUTES } from '../constants/routes';

interface ReportData {
  targetPlayerId: string;
  description: string;
  points: number;
  dateAction: string;
}

export const useReportAction = (
  competitionId: string,
  onSuccess: () => void,
) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ReportData>({
    targetPlayerId: '',
    description: '',
    points: 10,
    dateAction: new Date().toISOString().split('T')[0],
  });

  const handleChange = (field: keyof ReportData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitReport = async () => {
    if (!formData.targetPlayerId || !formData.description || !formData.points)
      return;

    setLoading(true);
    try {
      const response = await apiFetch(ROUTES.ACTIONS, {
        method: 'POST',
        body: JSON.stringify({
          description: formData.description,
          dateAction: formData.dateAction,
          points: Number(formData.points),
          player: ROUTES.API_GET_PLAYER(formData.targetPlayerId),
          competition: ROUTES.API_GET_COMPETITION(competitionId),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData((prev) => ({
          ...prev,
          targetPlayerId: '',
          description: '',
          points: 0,
        }));
        setTimeout(() => {
          onSuccess();
          setIsSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une action", error);
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, handleChange, submitReport, isSuccess };
};
