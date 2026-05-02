import { useState, useEffect } from 'react';

export const useCompetitionCountdown = (
  targetDate: string,
  onElapsed?: () => void,
) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isElapsed: boolean;
  } | null>(null);

  useEffect(() => {
    const targetTimestamp = new Date(targetDate).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = targetTimestamp - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isElapsed: true,
        });
        if (onElapsed) onElapsed();
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isElapsed: false,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onElapsed]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');
  const isUrgent =
    timeLeft !== null && !timeLeft.isElapsed && timeLeft.days === 0;

  return { timeLeft, formatTime, isUrgent };
};
