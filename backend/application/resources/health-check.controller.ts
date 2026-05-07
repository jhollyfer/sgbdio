import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';

@Controller()
export default class {
  @GET({
    url: '/health-check',
    options: {
      schema: {
        description: 'Checks the application health status',
        tags: ['Health'],
        summary: 'Application health check',
        response: {
          200: {
            description: 'Application is running correctly',
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['ok'],
                description: 'Health status indicator',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Current server timestamp',
              },
            },
            examples: [
              {
                status: 'ok',
                timestamp: '2023-12-01T10:30:00.000Z',
              },
            ],
          },
        },
      },
    },
  })
  async handle(_: FastifyRequest, response: FastifyReply): Promise<void> {
    return response.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
