import z from 'zod';

export const UserBulkRestoreBodyValidator = z.object({
  ids: z.array(z.string().trim().min(1)).min(1, 'Selecione pelo menos um item'),
});

export type UserBulkRestorePayload = z.infer<
  typeof UserBulkRestoreBodyValidator
>;
