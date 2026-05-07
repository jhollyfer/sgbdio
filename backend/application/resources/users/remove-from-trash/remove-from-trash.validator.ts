import z from 'zod';

export const UserRemoveFromTrashParamValidator = z.object({
  _id: z
    .string({ message: 'O ID é obrigatório' })
    .trim()
    .min(1, 'O ID é obrigatório'),
});

export type UserRemoveFromTrashPayload = z.infer<
  typeof UserRemoveFromTrashParamValidator
>;
