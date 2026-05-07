import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, PUT } from 'fastify-decorators';

import { ResetPasswordSchema } from './reset-password.schema';
import UpdatePasswordRecoveryUseCase from './reset-password.use-case';
import { ResetPasswordBodyValidator } from './reset-password.validator';

@Controller({
  route: 'authentication',
})
export default class {
  constructor(
    private readonly useCase: UpdatePasswordRecoveryUseCase = getInstanceByToken(
      UpdatePasswordRecoveryUseCase,
    ),
  ) {}

  @PUT({
    url: '/recovery/update-password',
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false,
        }),
      ],
      schema: ResetPasswordSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const body = ResetPasswordBodyValidator.parse(request.body);

    const result = await this.useCase.execute({
      ...body,
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

    return response.status(200).send(result.value);
  }
}
