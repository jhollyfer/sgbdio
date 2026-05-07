import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { setCookieTokens } from '@application/utils/cookies.util';
import { createTokens } from '@application/utils/jwt.util';
import { Env } from '@start/env';

import { MagicLinkSchema } from './magic-link.schema';
import MagicLinkUseCase from './magic-link.use-case';
import { MagicLinkQueryValidator } from './magic-link.validator';

@Controller({
  route: '/authentication',
})
export default class {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly useCase: MagicLinkUseCase = getInstanceByToken(
      MagicLinkUseCase,
    ),
  ) {}

  @GET({
    url: '/magic-link',
    options: {
      schema: MagicLinkSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const payload = MagicLinkQueryValidator.parse(request.query);

    const result = await this.useCase.execute(payload);

    if (result.isLeft()) {
      const error = result.value;

      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
        ...(error.errors && { errors: error.errors }),
      });
    }

    const tokens = await createTokens(result.value, response);

    setCookieTokens(response, { ...tokens });

    return response
      .status(302)
      .redirect(Env.APPLICATION_CLIENT_URL.concat('/dashboard?authentication=success'));
  }
}
