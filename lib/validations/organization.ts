import z from 'zod';
export const createOrgSchema = z.object({
  name: z.string().min(4).max(16),
  slug: z.string().regex(/^[a-z0-9-]+$/),
});
