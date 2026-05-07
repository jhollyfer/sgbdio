import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { toUserResponse } from '../users.mapper';

import { UserCreateSchema } from './create.schema';
import UserCreateUseCase from './create.use-case';
import { UserCreateBodyValidator } from './create.validator';

@Controller()
export default class {
  constructor(
    private readonly useCase: UserCreateUseCase = getInstanceByToken(
      UserCreateUseCase,
    ),
  ) {}

  @POST({
    url: '/users',
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false,
        }),
      ],
      schema: UserCreateSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const body = UserCreateBodyValidator.parse(request.body);

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

    return response.status(201).send(toUserResponse(result.value));
  }
}
