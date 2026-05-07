import z from 'zod';

export const UserDeleteParamValidator = z.object({
  _id: z
    .string({ message: 'O ID é obrigatório' })
    .trim()
    .min(1, 'O ID é obrigatório'),
});

export type UserDeletePayload = z.infer<typeof UserDeleteParamValidator> & {
  actorId: string;
};
