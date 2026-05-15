import { z } from 'zod';
import { ERRORS, RULES } from '@/constants';

export const loginSchema = z.object({
  username: z.string().min(1, { message: ERRORS.VALIDATION.REQUIRED }),
  password: z.string().min(1, { message: ERRORS.VALIDATION.REQUIRED }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    display_name: z
      .string()
      .min(RULES.AUTH.MIN_DISPLAY_NAME, {
        message: ERRORS.AUTH.INVALID_DISPLAY_NAME,
      }),
    username: z
      .string()
      .min(RULES.AUTH.MIN_USERNAME, { message: ERRORS.AUTH.INVALID_USERNAME }),
    email: z.email({ message: ERRORS.AUTH.INVALID_EMAIL }),
    plain_password: z
      .string()
      .min(RULES.AUTH.MIN_PASSWORD, {
        message: ERRORS.AUTH.INVALID_PLAIN_PASSWORD,
      }),
    confirm_password: z.string(),
    player_id: z.string().nullable().optional(),
  })
  .refine((data) => data.plain_password === data.confirm_password, {
    message: ERRORS.AUTH.INVALID_CONFIRM_PASSWORD,
    path: ['confirm_password'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
