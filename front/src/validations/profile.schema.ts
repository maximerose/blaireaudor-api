import { z } from 'zod';
import { ERRORS, RULES } from '@/shared';

export const updateProfileInfoSchema = z.object({
  display_name: z.string().min(RULES.AUTH.MIN_DISPLAY_NAME, {
    message: ERRORS.AUTH.INVALID_DISPLAY_NAME,
  }),
  username: z
    .string()
    .min(RULES.AUTH.MIN_USERNAME, { message: ERRORS.AUTH.INVALID_USERNAME }),
  email: z.email({ message: ERRORS.AUTH.INVALID_EMAIL }),
});

export type UpdateProfileInfoData = z.infer<typeof updateProfileInfoSchema>;

export const updatePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: ERRORS.VALIDATION.REQUIRED }),
    new_password: z.string().min(RULES.AUTH.MIN_PASSWORD, {
      message: ERRORS.AUTH.INVALID_PLAIN_PASSWORD,
    }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: ERRORS.AUTH.INVALID_CONFIRM_PASSWORD,
    path: ['confirm_password'],
  });

export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;
