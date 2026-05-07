import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { toUserResponse } from '../users.mapper';

import { UserShowSchema } from './show.schema';
import UserShowUseCase from './show.use-case';
import { UserShowParamValidator } from './show.validator';

@Controller({
  route: '/users',
})
export default class {
  constructor(
    private readonly useCase: UserShowUseCase = getInstanceByToken(
      UserShowUseCase,
    ),
  ) {}

  @GET({
    url: '/:_id',
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false,
        }),
      ],
      schema: UserShowSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const params = UserShowParamValidator.parse(request.params);

    const result = await this.useCase.execute(params);

    if (result.isLeft()) {
      const error = result.value;

      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
        ...(error.errors && { errors: error.errors }),
      });
    }

    return response.status(200).send(toUserResponse(result.value));
  }
}
