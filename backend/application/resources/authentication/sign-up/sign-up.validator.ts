import z from 'zod';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;

export const SignUpBodyValidator = z.object({
  name: z
    .string({ message: 'O nome é obrigatório' })
    .min(1, 'O nome é obrigatório')
    .trim(),
  email: z
    .string({ message: 'O email é obrigatório' })
    .email('Digite um email válido')
    .trim(),
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(
      passwordRegex,
      'A senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 especial',
    )
    .trim(),
});

export type SignUpPayload = z.infer<typeof SignUpBodyValidator>;
