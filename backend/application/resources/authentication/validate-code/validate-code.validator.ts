import z from 'zod';

export const ValidateCodeBodyValidator = z.object({
  code: z
    .string({ message: 'O código é obrigatório' })
    .min(1, 'O código é obrigatório')
    .trim(),
});

export type ValidateCodePayload = z.infer<typeof ValidateCodeBodyValidator>;
