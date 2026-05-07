/* eslint-disable no-unused-vars */
import { type FastifyRequest } from 'fastify';

import HTTPException from '@application/core/exception.core';
import { type Role } from '@application/core/role.core';

type Middleware = (request: FastifyRequest) => Promise<void>;

export function RoleMiddleware(allowedRoles: Role[]): Middleware {
  const allowed = new Set(allowedRoles);

  return async function (request: FastifyRequest): Promise<void> {
    if (!request.user) {
      throw HTTPException.Unauthorized(
        'Autenticação necessária',
        'AUTHENTICATION_REQUIRED',
      );
    }

    if (!allowed.has(request.user.role)) {
      throw HTTPException.Forbidden(
        'Permissão insuficiente para esta operação',
        'FORBIDDEN',
      );
    }
  };
}
