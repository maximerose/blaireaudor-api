import { ERRORS, RULES } from '@/constants';
import z from 'zod';

export const editCompetitionSchema = z
  .object({
    name: z
      .string()
      .min(RULES.COMPETITION.MIN_NAME, {
        error: ERRORS.COMPETITION.INVALID_NAME,
      }),
    joinCode: z
      .string()
      .min(3, { error: ERRORS.COMPETITION.INVALID_JOIN_CODE }),

    startDate: z.string().min(1, { error: ERRORS.VALIDATION.REQUIRED }),
    startFullDay: z.boolean(),
    startTime: z
      .string()
      .nullable()
      .transform((val) => (val === '' ? null : val)),

    endDate: z
      .string()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
    endFullDay: z.boolean(),
    endTime: z
      .string()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      error: ERRORS.COMPETITION.INVALID_DATE_ORDER,
      path: ['endDate'],
    },
  );

export type EditCompetitionFormData = z.infer<typeof editCompetitionSchema>;
