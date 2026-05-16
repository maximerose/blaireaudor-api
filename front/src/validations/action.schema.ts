import { ERRORS, RULES } from '@/constants';
import z from 'zod';

export const reportActionSchema = z.object({
  targetPlayerId: z.string().min(1, { error: ERRORS.ACTION.INVALID_PLAYER }),
  description: z.string().min(RULES.ACTION.MIN_DESCRIPTION, {
    error: ERRORS.ACTION.INVALID_DESCRIPTION,
  }),
  points: z
    .number({ error: ERRORS.ACTION.INVALID_POINTS })
    .int({ error: ERRORS.ACTION.INVALID_POINTS }),
  dateAction: z.string().min(1, { error: ERRORS.ACTION.INVALID_DATE }),
});

export type ReportActionFormData = z.infer<typeof reportActionSchema>;
