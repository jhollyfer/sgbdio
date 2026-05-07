import type { FastifyReply } from 'fastify';

import { Env } from '@start/env';

import type { TokenPair } from './jwt.util';

export const clearCookieTokens = (response: FastifyReply): void => {
  const cookieOptions = {
    path: '/',
    secure: Env.NODE_ENV === 'production',
    sameSite:
      Env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
    httpOnly: true,
    ...(Env.COOKIE_DOMAIN && { domain: Env.COOKIE_DOMAIN }),
  };

  response
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions);
};

export const setCookieTokens = (
  response: FastifyReply,
  tokens: TokenPair,
): void => {
  const cookieOptions = {
    path: '/',
    secure: Env.NODE_ENV === 'production',
    sameSite:
      Env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
    httpOnly: true,
    ...(Env.COOKIE_DOMAIN && { domain: Env.COOKIE_DOMAIN }),
  };

  response
    .setCookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 1000, // 24h
    })
    .setCookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 7 * 24 * 1000, // 7d
    });
};
