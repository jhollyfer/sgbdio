import { IJWTPayload } from '@application/core/entity.core';
import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: IJWTPayload;
  }
}
