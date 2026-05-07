import type { Merge } from '@application/core/entity.core';
import { PASSWORD_REGEX } from '@application/core/password.constants';
import z from 'zod';

export const ProfileUpdateBodyValidator = z.object({
  name: z
    .string({ message: 'O nome é obrigatório' })
    .min(1, 'O nome é obrigatório')
    .trim(),
  email: z
    .string({ message: 'O email é obrigatório' })
    .email('Digite um email válido')
    .trim(),
  currentPassword: z
    .string({ message: 'A senha atual deve ser um texto' })
    .trim()
    .optional(),
  newPassword: z
    .string({ message: 'A nova senha deve ser um texto' })
    .min(6, 'A nova senha deve ter no mínimo 6 caracteres')
    .regex(
      PASSWORD_REGEX,
      'A nova senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 especial',
    )
    .trim()
    .optional(),
  allowPasswordChange: z.coerce.boolean().default(false),
});

export const ProfileUpdateParamsValidator = z.object({
  _id: z.string({ message: 'O ID é obrigatório' }).trim(),
});

export type ProfileUpdatePayload = Merge<
  z.infer<typeof ProfileUpdateParamsValidator>,
  z.infer<typeof ProfileUpdateBodyValidator>
>;
