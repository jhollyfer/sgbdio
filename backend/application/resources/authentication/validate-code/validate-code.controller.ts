import {
  clearCookieTokens,
  setCookieTokens,
} from '@application/utils/cookies.util';
import { createTokens } from '@application/utils/jwt.util';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { ValidateCodeSchema } from './validate-code.schema';
import ValidateCodeUseCase from './validate-code.use-case';
import { ValidateCodeBodyValidator } from './validate-code.validator';

@Controller({
  route: 'authentication',
})
export default class {
  constructor(
    private readonly useCase: ValidateCodeUseCase = getInstanceByToken(
      ValidateCodeUseCase,
    ),
  ) {}

  @POST({
    url: '/recovery/validate-code',
    options: {
      schema: ValidateCodeSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const body = ValidateCodeBodyValidator.parse(request.body);

    const result = await this.useCase.execute(body);

    if (result.isLeft()) {
      const error = result.value;

      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
        ...(error.errors && { errors: error.errors }),
      });
    }

    const tokens = await createTokens(result.value.user, response);

    clearCookieTokens(response);
    setCookieTokens(response, { ...tokens });

    return response.status(200).send(result.value);
  }
}
