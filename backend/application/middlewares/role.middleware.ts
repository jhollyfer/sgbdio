import HTTPException from '@application/core/exception.core';
import { type Role } from '@application/core/role.core';
import { type FastifyRequest } from 'fastify';

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
