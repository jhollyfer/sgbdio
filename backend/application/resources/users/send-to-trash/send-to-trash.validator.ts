import z from 'zod';

export const UserSendToTrashParamValidator = z.object({
  _id: z
    .string({ message: 'O ID é obrigatório' })
    .trim()
    .min(1, 'O ID é obrigatório'),
});

export type UserSendToTrashPayload = z.infer<
  typeof UserSendToTrashParamValidator
> & {
  actorId: string;
  actorRole: string;
};
