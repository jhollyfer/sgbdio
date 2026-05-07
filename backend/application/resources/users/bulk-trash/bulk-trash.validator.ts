import z from 'zod';

export const UserBulkTrashBodyValidator = z.object({
  ids: z.array(z.string().trim().min(1)).min(1, 'Selecione pelo menos um item'),
});

export type UserBulkTrashPayload = z.infer<
  typeof UserBulkTrashBodyValidator
> & {
  actorId: string;
};
