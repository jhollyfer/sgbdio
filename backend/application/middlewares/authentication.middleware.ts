import { E_JWT_TYPE, type IJWTPayload } from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { type FastifyRequest } from 'fastify';

interface AuthOptions {
  optional?: boolean;
}

function extractLastCookieValue(
  cookieHeader: string | undefined,
  name: string,
): string | undefined {
  if (!cookieHeader) return undefined;
  let lastValue: string | undefined;
  for (const part of cookieHeader.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) {
      lastValue = rest.join('=');
    }
  }
  return lastValue;
}

export function AuthenticationMiddleware(
  options: AuthOptions = { optional: false },
) {
  return async function (request: FastifyRequest): Promise<void> {
    try {
      const accessToken =
        extractLastCookieValue(request.headers.cookie, 'accessToken') ??
        request.cookies.accessToken;

      if (!accessToken) {
        if (options.optional) return;
        throw HTTPException.Unauthorized(
          'Autenticação necessária',
          'AUTHENTICATION_REQUIRED',
        );
      }

      const accessTokenDecoded: IJWTPayload | null =
        await request.server.jwt.decode(String(accessToken));

      if (
        !accessTokenDecoded ||
        accessTokenDecoded.type !== E_JWT_TYPE.ACCESS
      ) {
        if (options.optional) return;
        throw HTTPException.Unauthorized(
          'Autenticação necessária',
          'AUTHENTICATION_REQUIRED',
        );
      }

      request.user = {
        sub: accessTokenDecoded.sub,
        email: accessTokenDecoded.email,
        role: accessTokenDecoded.role,
        type: E_JWT_TYPE.ACCESS,
      };
    } catch {
      if (options.optional) return;

      throw HTTPException.Unauthorized(
        'Autenticação necessária',
        'AUTHENTICATION_REQUIRED',
      );
    }
  };
}
