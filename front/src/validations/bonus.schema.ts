import { ERRORS, RULES } from '@/constants';
import z from 'zod';

export const getBonusDaySchema = (minDate: string, maxDate: string) =>
  z.object({
    newDate: z
      .string()
      .min(1, { error: ERRORS.VALIDATION.REQUIRED })
      .refine((date) => date >= minDate, { error: ERRORS.BONUS.INVALID_DATES })
      .refine((date) => !maxDate || date <= maxDate, {
        error: ERRORS.BONUS.INVALID_DATES,
      }),
    multiplier: z
      .number({ error: ERRORS.BONUS.INVALID_MULTIPLIER })
      .int()
      .min(RULES.BONUS.MIN_MULTIPLIER, {
        error: ERRORS.BONUS.INVALID_MULTIPLIER,
      }),
  });

export type BonusDayFormData = z.infer<ReturnType<typeof getBonusDaySchema>>;
