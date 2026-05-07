import { E_USER_STATUS, type Merge } from '@application/core/entity.core';
import { PASSWORD_REGEX } from '@application/core/password.constants';
import z from 'zod';

import { UserBaseValidator } from '../user-base.validator';

const STATUS_VALUES = Object.values(E_USER_STATUS);

export const UserUpdateBodyValidator = UserBaseValidator.partial().extend({
  password: z
    .string({ message: 'A senha deve ser um texto' })
    .trim()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(
      PASSWORD_REGEX,
      'A senha deve conter: 1 maiúscula, 1 minúscula, 1 número e 1 especial',
    )
    .optional(),
  status: z
    .enum(STATUS_VALUES, {
      message: 'O status deve ser ACTIVE ou INACTIVE',
    })
    .optional(),
});

export const UserUpdateParamsValidator = z.object({
  _id: z
    .string({ message: 'O ID é obrigatório' })
    .trim()
    .min(1, 'O ID é obrigatório'),
});

export type UserUpdatePayload = Merge<
  z.infer<typeof UserUpdateParamsValidator>,
  z.infer<typeof UserUpdateBodyValidator>
>;
