/* eslint-disable no-unused-vars */
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';

import { toUserPaginatedResponse } from '../users.mapper';

import { UserPaginatedSchema } from './paginated.schema';
import UserPaginatedUseCase from './paginated.use-case';
import { UserPaginatedQueryValidator } from './paginated.validator';

@Controller({
  route: '/users',
})
export default class {
  constructor(
    private readonly useCase: UserPaginatedUseCase = getInstanceByToken(
      UserPaginatedUseCase,
    ),
  ) {}

  @GET({
    url: '/paginated',
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false,
        }),
      ],
      schema: UserPaginatedSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const query = UserPaginatedQueryValidator.parse(request.query);

    const result = await this.useCase.execute({
      ...query,
      user: {
        _id: request?.user?.sub,
        role: request?.user?.role,
      },
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

    return response.status(200).send(toUserPaginatedResponse(result.value));
  }
}
