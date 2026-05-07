import z from 'zod';

export const RequestCodeBodyValidator = z.object({
  email: z
    .string({ message: 'O email é obrigatório' })
    .email('Digite um email válido')
    .trim(),
});

export type RequestCodePayload = z.infer<typeof RequestCodeBodyValidator>;
