import z from 'zod';

export const MagicLinkQueryValidator = z.object({
  code: z
    .string({ message: 'O código é obrigatório' })
    .min(1, 'O código é obrigatório')
    .trim(),
});

export type MagicLinkPayload = z.infer<typeof MagicLinkQueryValidator>;
