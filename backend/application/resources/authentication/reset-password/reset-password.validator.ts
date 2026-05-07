import type { IUser, Merge } from '@application/core/entity.core';
import { PASSWORD_REGEX } from '@application/core/password.constants';
import z from 'zod';

export const ResetPasswordBodyValidator = z.object({
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(
      PASSWORD_REGEX,
      'A senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 especial',
    )
    .trim(),
});

export type ResetPasswordPayload = Merge<
  z.infer<typeof ResetPasswordBodyValidator>,
  Pick<IUser, '_id'>
>;
