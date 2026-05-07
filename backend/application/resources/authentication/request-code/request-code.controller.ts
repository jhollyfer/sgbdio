/* eslint-disable no-unused-vars */
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { RequestCodeSchema } from './request-code.schema';
import RequestCodeUseCase from './request-code.use-case';
import { RequestCodeBodyValidator } from './request-code.validator';

@Controller({
  route: 'authentication',
})
export default class {
  constructor(
    private readonly useCase: RequestCodeUseCase = getInstanceByToken(
      RequestCodeUseCase,
    ),
  ) {}

  @POST({
    url: '/recovery/request-code',
    options: {
      schema: RequestCodeSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const body = RequestCodeBodyValidator.parse(request.body);

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

    return response.status(200).send(result.value);
  }
}
