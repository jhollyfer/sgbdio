import {
  E_USER_STATUS,
  type IUser,
  type Merge,
} from '@application/core/entity.core';
import { Role } from '@application/core/role.core';
import z from 'zod';

const STATUS_VALUES = Object.values(E_USER_STATUS);
const ROLE_VALUES = Object.values(Role);

export const UserPaginatedQueryValidator = z.object({
  page: z.coerce
    .number({ message: 'A página deve ser um número' })
    .min(1, 'A página deve ser maior que zero')
    .default(1),
  perPage: z.coerce
    .number({ message: 'O limite por página deve ser um número' })
    .min(1, 'O limite por página deve ser maior que zero')
    .max(100, 'O limite por página deve ser no máximo 100')
    .default(50),
  search: z.string({ message: 'A busca deve ser um texto' }).trim().optional(),

  trashed: z
    .preprocess(
      (v): unknown => {
        if (typeof v === 'boolean') return String(v);
        return v;
      },
      z.enum(['true', 'false']).transform((v): boolean => v === 'true'),
    )
    .optional(),

  status: z.enum(STATUS_VALUES, { message: 'Status inválido' }).optional(),

  role: z.enum(ROLE_VALUES, { message: 'Role inválido' }).optional(),

  'order-name': z.enum(['asc', 'desc']).optional(),
  'order-email': z.enum(['asc', 'desc']).optional(),
  'order-role': z.enum(['asc', 'desc']).optional(),
  'order-status': z.enum(['asc', 'desc']).optional(),
  'order-created-at': z.enum(['asc', 'desc']).optional(),
});

export type UserPaginatedPayload = Merge<
  z.infer<typeof UserPaginatedQueryValidator>,
  {
    user?: Merge<
      Pick<IUser, '_id'>,
      {
        role: Role;
      }
    >;
  }
>;
