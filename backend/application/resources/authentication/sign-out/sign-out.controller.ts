import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, POST } from 'fastify-decorators';

import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { clearCookieTokens } from '@application/utils/cookies.util';

import { SignOutSchema } from './sign-out.schema';

@Controller({
  route: 'authentication',
})
export default class {
  @POST({
    url: '/sign-out',
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false,
        }),
      ],
      schema: SignOutSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    clearCookieTokens(response);

    return response.status(200).send({ message: 'Successfully signed out' });
  }
}
