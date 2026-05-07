import type { FastifySchema } from 'fastify';

export const SignOutSchema: FastifySchema = {
  tags: ['Autenticação'],
  summary: 'Logout do usuário',
  description:
    'Realiza o logout do usuário atual limpando os cookies de autenticação. Requer token de acesso válido',
  security: [{ cookieAuth: [] }],
  response: {
    200: {
      description: 'Logout realizado com sucesso',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Logout realizado com sucesso'] },
      },
    },
    401: {
      description: 'Não autorizado - Token de acesso inválido ou ausente',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Autenticação necessária'] },
        code: { type: 'number', enum: [401] },
        cause: { type: 'string', enum: ['AUTHENTICATION_REQUIRED'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Autenticação necessária',
          code: 401,
          cause: 'AUTHENTICATION_REQUIRED',
        },
      ],
    },
  },
};
