import z from 'zod';

export const SignInBodyValidator = z.object({
  email: z
    .string({ message: 'O email é obrigatório' })
    .email('Digite um email válido')
    .trim(),
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(1, 'A senha é obrigatória')
    .trim(),
});

export type SignInPayload = z.infer<typeof SignInBodyValidator>;
