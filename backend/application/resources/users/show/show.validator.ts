import z from 'zod';

export const UserShowParamValidator = z.object({
  _id: z
    .string({ message: 'O ID é obrigatório' })
    .min(1, 'O ID é obrigatório')
    .trim(),
});

export type UserShowPayload = z.infer<typeof UserShowParamValidator>;
