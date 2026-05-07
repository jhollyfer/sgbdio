import type { FastifySchema } from 'fastify';

export const ValidateCodeSchema: FastifySchema = {
  tags: ['Autenticação'],
  summary: 'Validar código de recuperação de senha',
  description:
    'Valida um código de recuperação de senha e retorna um token temporário para redefinição de senha',
  body: {
    type: 'object',
    required: ['code'],
    properties: {
      code: {
        type: 'string',
        description: 'Código de recuperação recebido via email',
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
    200: {
      description: 'Código validado com sucesso',
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'Token temporário para redefinição de senha',
        },
        message: { type: 'string' },
      },
    },
    404: {
      description: 'Não encontrado - Token de validação não encontrado',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          enum: ['Token de validação não encontrado'],
        },
        code: { type: 'number', enum: [404] },
        cause: { type: 'string', enum: ['VALIDATION_TOKEN_NOT_FOUND'] },
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
      ],
    },
    410: {
      description: 'Expirado - Token de validação expirado',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          enum: ['Código expirado', 'Token de validação expirado'],
        },
        code: { type: 'number', enum: [410] },
        cause: { type: 'string', enum: ['VALIDATION_TOKEN_EXPIRED'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Código expirado',
          code: 410,
          cause: 'VALIDATION_TOKEN_EXPIRED',
        },
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
        cause: { type: 'string', enum: ['VALIDATE_CODE_ERROR'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Erro interno do servidor',
          code: 500,
          cause: 'VALIDATE_CODE_ERROR',
        },
      ],
    },
  },
};
