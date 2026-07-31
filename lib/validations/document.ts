import z from 'zod';
export const documentSchema = z.object({
  title: z.string().min(4),
  content: z.record(z.string(), z.unknown()).default({}),
});
