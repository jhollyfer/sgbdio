import z from 'zod';

export const UserBulkDeleteBodyValidator = z.object({
  ids: z.array(z.string().trim().min(1)).min(1, 'Selecione pelo menos um item'),
});

export type UserBulkDeletePayload = z.infer<
  typeof UserBulkDeleteBodyValidator
> & {
  actorId: string;
};
