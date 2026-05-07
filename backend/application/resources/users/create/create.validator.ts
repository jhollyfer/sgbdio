import z from 'zod';

import { PASSWORD_REGEX } from '@application/core/password.constants';

import { UserBaseValidator } from '../user-base.validator';

export const UserCreateBodyValidator = UserBaseValidator.extend({
  password: z
    .string({ message: 'A senha é obrigatória' })
    .trim()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(
      PASSWORD_REGEX,
      'A senha deve conter: 1 maiúscula, 1 minúscula, 1 número e 1 especial',
    ),
});

export type UserCreatePayload = z.infer<typeof UserCreateBodyValidator>;
