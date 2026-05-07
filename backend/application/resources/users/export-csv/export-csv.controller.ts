/* eslint-disable no-unused-vars */
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { buildCsvFilename } from '@application/core/csv/csv-filename';
import { Role } from '@application/core/role.core';
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { RoleMiddleware } from '@application/middlewares/role.middleware';

import { UserExportCsvSchema } from './export-csv.schema';
import UserExportCsvUseCase from './export-csv.use-case';
import { UserExportCsvQueryValidator } from './export-csv.validator';

@Controller({
  route: '/users',
})
export default class {
  constructor(
    private readonly useCase: UserExportCsvUseCase = getInstanceByToken(
      UserExportCsvUseCase,
    ),
  ) {}

  @GET({
    url: '/exports/csv',
    options: {
      onRequest: [
        AuthenticationMiddleware({ optional: false }),
        RoleMiddleware([Role.MASTER, Role.ADMINISTRATOR]),
      ],
      schema: UserExportCsvSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const query = UserExportCsvQueryValidator.parse(request.query);

    const result = await this.useCase.execute({
      ...query,
      user: request?.user
        ? { _id: request.user.sub, role: request.user.role }
        : undefined,
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

    const filename = buildCsvFilename('usuarios');

    return response
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .header('Cache-Control', 'no-store')
      .send(result.value);
  }
}
