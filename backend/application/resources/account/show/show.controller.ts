import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { toUserResponse } from '@application/resources/users/users.mapper';

import { ProfileShowSchema } from './show.schema';
import ProfileShowUseCase from './show.use-case';

@Controller({
  route: 'profile',
})
export default class {
  constructor(
    private readonly useCase: ProfileShowUseCase = getInstanceByToken(
      ProfileShowUseCase,
    ),
  ) {}

  @GET({
    url: '',
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false,
        }),
      ],
      schema: ProfileShowSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const result = await this.useCase.execute({
      _id: request.user.sub,
    });

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
