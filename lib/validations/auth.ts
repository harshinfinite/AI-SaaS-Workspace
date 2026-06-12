import z from 'zod';
export const registerSchema = z.object({
  name: z.string().min(4).max(16),
  email: z.email(),
  password: z.string().min(8).max(32),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(32),
});
