import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, PATCH } from 'fastify-decorators';

import { toUserResponse } from '../users.mapper';

import { UserUpdateSchema } from './update.schema';
import UserUpdateUseCase from './update.use-case';
import {
  UserUpdateBodyValidator,
  UserUpdateParamsValidator,
} from './update.validator';

@Controller({
  route: '/users',
})
export default class {
  constructor(
    private readonly useCase: UserUpdateUseCase = getInstanceByToken(
      UserUpdateUseCase,
    ),
  ) {}

  @PATCH({
    url: '/:_id',
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false,
        }),
      ],
      schema: UserUpdateSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const params = UserUpdateParamsValidator.parse(request.params);
    const payload = UserUpdateBodyValidator.parse(request.body);

    const result = await this.useCase.execute({
      ...params,
      ...payload,
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
