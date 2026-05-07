import type { FastifySchema } from 'fastify';

export const MagicLinkSchema: FastifySchema = {
  tags: ['Autenticação'],
  summary: 'Autenticação via magic link',
  description:
    'Autentica o usuário via magic link e redireciona para o dashboard com os cookies de autenticação configurados',
  querystring: {
    type: 'object',
    required: ['code'],
    properties: {
      code: {
        type: 'string',
        description: 'Código de autenticação do magic link',
        errorMessage: {
          type: 'O código deve ser um texto',
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        code: 'O código é obrigatório',
      },
      additionalProperties: 'Campos extras não são permitidos',
    },
  },
  response: {
    302: {
      description: 'Autenticação bem-sucedida - redireciona para o dashboard',
      type: 'object',
      properties: {},
    },
    404: {
      description: 'Não encontrado - Token ou usuário não encontrado',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          enum: ['Token de validação não encontrado', 'Usuário não encontrado'],
        },
        code: { type: 'number', enum: [404] },
        cause: {
          type: 'string',
          enum: ['VALIDATION_TOKEN_NOT_FOUND', 'USER_NOT_FOUND'],
        },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Token de validação não encontrado',
          code: 404,
          cause: 'VALIDATION_TOKEN_NOT_FOUND',
        },
        {
          message: 'Usuário não encontrado',
          code: 404,
          cause: 'USER_NOT_FOUND',
        },
      ],
    },
    409: {
      description: 'Conflito - Token já utilizado',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          enum: ['Token de validação já foi utilizado'],
        },
        code: { type: 'number', enum: [409] },
        cause: { type: 'string', enum: ['VALIDATION_TOKEN_ALREADY_USED'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Token de validação já foi utilizado',
          code: 409,
          cause: 'VALIDATION_TOKEN_ALREADY_USED',
        },
      ],
    },
    410: {
      description: 'Expirado - Token expirado',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Token de validação expirado'] },
        code: { type: 'number', enum: [410] },
        cause: { type: 'string', enum: ['VALIDATION_TOKEN_EXPIRED'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Token de validação expirado',
          code: 410,
          cause: 'VALIDATION_TOKEN_EXPIRED',
        },
      ],
    },
    500: {
      description: 'Erro interno do servidor',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Erro interno do servidor'] },
        code: { type: 'number', enum: [500] },
        cause: { type: 'string', enum: ['MAGIC_LINK_ERROR'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Erro interno do servidor',
          code: 500,
          cause: 'MAGIC_LINK_ERROR',
        },
      ],
    },
  },
};
