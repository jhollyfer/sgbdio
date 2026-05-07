import z from 'zod';

import { Role } from '@application/core/role.core';

const ROLE_VALUES = Object.values(Role);

export const UserBaseValidator = z.object({
  name: z
    .string({ message: 'O nome é obrigatório' })
    .trim()
    .min(1, 'O nome é obrigatório'),
  email: z
    .string({ message: 'O email é obrigatório' })
    .email('Digite um email válido')
    .trim(),
  role: z.enum(ROLE_VALUES, { message: 'Role inválido' }),
});

export type UserBasePayload = z.infer<typeof UserBaseValidator>;
