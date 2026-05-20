import { ERRORS, RULES } from '@/shared';
import type { FormParticipant } from '@/types';
import { z } from 'zod';

export const createCompetitionSchema = z
  .object({
    name: z.string().min(RULES.COMPETITION.MIN_NAME, {
      error: ERRORS.COMPETITION.INVALID_NAME,
    }),
    joinCode: z
      .string()
      .nullable()
      .transform((val) => (val === '' ? null : val)),

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

    fogOfWar: z.boolean(),
    participate: z.boolean(),
    isCreatorReferee: z.boolean(),

    players: z.array(z.custom<FormParticipant>()),
    referees: z.array(z.custom<FormParticipant>()),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: ERRORS.COMPETITION.INVALID_DATE_ORDER,
      path: ['endDate'],
    },
  )
  .refine(
    (data) => {
      return data.isCreatorReferee || data.referees.length > 0;
    },
    {
      message: ERRORS.COMPETITION.NO_REFEREE,
      path: ['referees'],
    },
  );

export type CreateCompetitionFormData = z.infer<typeof createCompetitionSchema>;

export const editCompetitionSchema = z
  .object({
    name: z.string().min(RULES.COMPETITION.MIN_NAME, {
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
