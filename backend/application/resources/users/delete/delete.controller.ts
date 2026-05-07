import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, getInstanceByToken } from 'fastify-decorators';

import { Role } from '@application/core/role.core';
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { RoleMiddleware } from '@application/middlewares/role.middleware';

import { UserDeleteSchema } from './delete.schema';
import UserDeleteUseCase from './delete.use-case';
import { UserDeleteParamValidator } from './delete.validator';

@Controller({
  route: '/users',
})
export default class {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly useCase: UserDeleteUseCase = getInstanceByToken(
      UserDeleteUseCase,
    ),
  ) {}

  @DELETE({
    url: '/:_id',
    options: {
      onRequest: [
        AuthenticationMiddleware({ optional: false }),
        RoleMiddleware([Role.MASTER]),
      ],
      schema: UserDeleteSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const params = UserDeleteParamValidator.parse(request.params);

    if (!request.user) {
      return response.status(401).send({
        message: 'Autenticação necessária',
        code: 401,
        cause: 'AUTHENTICATION_REQUIRED',
      });
    }

    const result = await this.useCase.execute({
      _id: params._id,
      actorId: request.user.sub,
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

    return response.status(200).send(null);
  }
}
