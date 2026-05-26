import { useState } from 'react';
import type { ChartDataPoint } from '@/features/stats/types';

export const useAnalyticChartUI = (bumpData: ChartDataPoint[]) => {
  const [chartMode, setChartMode] = useState<'ranks' | 'points'>('ranks');

  // Si on a plus de 15 jours de données, on désactive les gros points sur les lignes pour ne pas surcharger la vue
  const isDense = bumpData.length > 15;

  return {
    chartMode,
    setChartMode,
    isDense,
  };
};
