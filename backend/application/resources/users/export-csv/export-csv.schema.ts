import type { FastifySchema } from 'fastify';

export const UserExportCsvSchema: FastifySchema = {
  tags: ['Users'],
  summary: 'Exporta usuários em CSV',
  description:
    'Gera um arquivo CSV com todos os usuários que casam com os filtros aplicados. Restrito a MASTER e ADMINISTRATOR. Cap de 500.000 linhas por export.',
  security: [{ cookieAuth: [] }],
  querystring: {
    type: 'object',
    properties: {
      search: { type: 'string', minLength: 1 },
      status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
      trashed: { type: 'string', enum: ['true', 'false'] },
      role: {
        type: 'string',
        enum: ['MASTER', 'ADMINISTRATOR'],
      },
      'order-name': { type: 'string', enum: ['asc', 'desc'] },
      'order-email': { type: 'string', enum: ['asc', 'desc'] },
      'order-role': { type: 'string', enum: ['asc', 'desc'] },
      'order-status': { type: 'string', enum: ['asc', 'desc'] },
      'order-created-at': { type: 'string', enum: ['asc', 'desc'] },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Arquivo CSV',
      type: 'string',
      format: 'binary',
    },
    401: {
      description: 'Unauthorized',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number', enum: [401] },
        cause: { type: 'string' },
        errors: { type: 'object', additionalProperties: { type: 'string' } },
      },
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number', enum: [403] },
        cause: { type: 'string' },
        errors: { type: 'object', additionalProperties: { type: 'string' } },
      },
    },
    422: {
      description: 'Limite de exportação excedido',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number', enum: [422] },
        cause: { type: 'string', enum: ['EXPORT_LIMIT_EXCEEDED'] },
        errors: { type: 'object', additionalProperties: { type: 'string' } },
      },
    },
    500: {
      description: 'Erro interno',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number', enum: [500] },
        cause: { type: 'string', enum: ['EXPORT_USER_CSV_ERROR'] },
        errors: { type: 'object', additionalProperties: { type: 'string' } },
      },
    },
  },
};
