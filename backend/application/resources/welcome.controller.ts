import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';

@Controller()
export default class {
  @GET({
    url: '',
    options: {
      schema: {
        description: 'Redirects to the API documentation',
        tags: ['API'],
        summary: 'Welcome page redirect to documentation',
        response: {
          302: {
            description: 'Redirect to /documentation',
            headers: {
              location: {
                type: 'string',
                description: 'Redirect destination URL',
                examples: ['/documentation'],
              },
            },
            type: 'object',
            properties: {
              message: {
                type: 'string',
                enum: ['SGBDIO API'],
                description: 'Welcome message',
              },
            },
            examples: [
              {
                message: 'SGBDIO API',
              },
            ],
          },
        },
      },
    },
  })
  async handle(_: FastifyRequest, response: FastifyReply): Promise<void> {
    return response.redirect('/documentation').send({
      message: 'SGBDIO API',
    });
  }
}
