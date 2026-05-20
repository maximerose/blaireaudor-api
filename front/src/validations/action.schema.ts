import { ERRORS, RULES } from '@/shared';
import z from 'zod';

export const getReportActionSchema = (minDate: string, maxDate: string) =>
  z.object({
    targetPlayerId: z.string().min(1, { error: ERRORS.ACTION.INVALID_PLAYER }),
    description: z.string().min(RULES.ACTION.MIN_DESCRIPTION, {
      error: ERRORS.ACTION.INVALID_DESCRIPTION,
    }),
    points: z
      .number({ error: ERRORS.ACTION.INVALID_POINTS })
      .int({ error: ERRORS.ACTION.INVALID_POINTS }),
    dateAction: z
      .string()
      .min(1, { error: ERRORS.ACTION.INVALID_DATE })
      .refine((date) => !minDate || date >= minDate, {
        error: ERRORS.ACTION.OUT_OF_BOUNDS,
      })
      .refine((date) => !maxDate || date <= maxDate, {
        error: ERRORS.ACTION.OUT_OF_BOUNDS,
      }),
  });

export type ReportActionFormData = z.infer<
  ReturnType<typeof getReportActionSchema>
>;
