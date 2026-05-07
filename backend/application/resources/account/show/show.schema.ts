import type { FastifySchema } from 'fastify';

export const ProfileShowSchema: FastifySchema = {
  tags: ['Perfil'],
  summary: 'Buscar perfil do usuário atual',
  description:
    'Retorna as informações do perfil do usuário autenticado incluindo dados pessoais, grupo e permissões',
  security: [{ cookieAuth: [] }],
  response: {
    200: {
      description: 'Perfil do usuário recuperado com sucesso',
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'ID do usuário' },
        name: { type: 'string', description: 'Nome completo do usuário' },
        email: {
          type: 'string',
          format: 'email',
          description: 'Email do usuário',
        },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE'],
          description: 'Status da conta do usuário',
        },
        role: {
          type: 'string',
          enum: ['MASTER', 'ADMINISTRATOR'],
          description: 'Role do usuário',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Data de criação da conta',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Data da última atualização do perfil',
        },
      },
    },
    401: {
      description: 'Não autorizado - Autenticação necessária',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Não autorizado'] },
        code: { type: 'number', enum: [401] },
        cause: { type: 'string', enum: ['AUTHENTICATION_REQUIRED'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
    },
    404: {
      description: 'Usuário não encontrado',
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
        cause: { type: 'string', enum: ['GET_USER_PROFILE_ERROR'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
    },
  },
};
