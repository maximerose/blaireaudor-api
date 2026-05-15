import { z } from 'zod';
import { FORM } from '@/constants';

export const loginSchema = z.object({
  username: z.string().min(1, { message: FORM.SHARED.VALIDATION.REQUIRED }),
  password: z.string().min(1, { message: FORM.SHARED.VALIDATION.REQUIRED }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
