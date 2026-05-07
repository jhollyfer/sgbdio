import type { FastifySchema } from 'fastify';

export const RequestCodeSchema: FastifySchema = {
  tags: ['Autenticação'],
  summary: 'Solicitar código de recuperação de senha',
  description:
    'Envia um código de recuperação de senha para o endereço de email especificado',
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Endereço de email para enviar o código de recuperação',
        errorMessage: {
          type: 'O email deve ser um texto',
          format: 'Digite um email válido',
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        email: 'O email é obrigatório',
      },
      additionalProperties: 'Campos extras não são permitidos',
    },
  },
  response: {
    200: {
      description: 'Código de recuperação enviado com sucesso',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      description: 'Requisição inválida - Email inválido ou erro de validação',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Formato de email inválido'] },
        code: { type: 'number', enum: [400] },
        cause: { type: 'string', enum: ['INVALID_PARAMETERS'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Formato de email inválido',
          code: 400,
          cause: 'INVALID_PARAMETERS',
        },
      ],
    },
    404: {
      description: 'Email não encontrado',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Email não encontrado'] },
        code: { type: 'number', enum: [404] },
        cause: { type: 'string', enum: ['EMAIL_NOT_FOUND'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Email não encontrado',
          code: 404,
          cause: 'EMAIL_NOT_FOUND',
        },
      ],
    },
    500: {
      description: 'Erro interno do servidor',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Erro interno do servidor'] },
        code: { type: 'number', enum: [500] },
        cause: { type: 'string', enum: ['INTERNAL_SERVER_ERROR'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Erro interno do servidor',
          code: 500,
          cause: 'INTERNAL_SERVER_ERROR',
        },
      ],
    },
  },
};
