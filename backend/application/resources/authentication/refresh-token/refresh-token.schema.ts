import type { FastifySchema } from 'fastify';

export const RefreshTokenSchema: FastifySchema = {
  tags: ['Autenticação'],
  summary: 'Renovar tokens de autenticação',
  description:
    'Renova os tokens de acesso e refresh usando o token de refresh atual dos cookies. Requer cookie de refresh token válido',
  security: [{ cookieAuth: [] }],
  response: {
    200: {
      description: 'Tokens renovados com sucesso',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          enum: ['Tokens renovados com sucesso'],
        },
      },
    },
    401: {
      description: 'Não autorizado - Refresh token ausente ou inválido',
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Mensagem de erro' },
        code: { type: 'number', enum: [401] },
        cause: {
          type: 'string',
          enum: ['MISSING_REFRESH_TOKEN', 'INVALID_REFRESH_TOKEN'],
        },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Refresh token ausente',
          code: 401,
          cause: 'MISSING_REFRESH_TOKEN',
        },
        {
          message: 'Refresh token inválido ou expirado',
          code: 401,
          cause: 'INVALID_REFRESH_TOKEN',
        },
      ],
    },
    404: {
      description: 'Não encontrado - Usuário não encontrado',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Usuário não encontrado'] },
        code: { type: 'number', enum: [404] },
        cause: { type: 'string', enum: ['USER_NOT_FOUND'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Usuário não encontrado',
          code: 404,
          cause: 'USER_NOT_FOUND',
        },
      ],
    },
    500: {
      description: 'Erro interno do servidor',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Erro interno do servidor'] },
        code: { type: 'number', enum: [500] },
        cause: { type: 'string', enum: ['REFRESH_TOKEN_ERROR'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Erro interno do servidor',
          code: 500,
          cause: 'REFRESH_TOKEN_ERROR',
        },
      ],
    },
  },
};
