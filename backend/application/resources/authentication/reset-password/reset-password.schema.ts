import type { FastifySchema } from 'fastify';

export const ResetPasswordSchema: FastifySchema = {
  tags: ['Autenticação'],
  summary: 'Atualizar senha após recuperação',
  description:
    'Atualiza a senha do usuário usando um token de recuperação válido obtido da validação do código',
  body: {
    type: 'object',
    required: ['password'],
    properties: {
      password: {
        type: 'string',
        minLength: 6,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])',
        description:
          'Nova senha (mínimo 6 caracteres, deve conter maiúscula, minúscula, número e caractere especial)',
        errorMessage: {
          type: 'A senha deve ser um texto',
          minLength: 'A senha deve ter no mínimo 6 caracteres',
          pattern:
            'A senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 especial',
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        password: 'A senha é obrigatória',
      },
      additionalProperties: 'Campos extras não são permitidos',
    },
  },
  response: {
    200: {
      description: 'Senha atualizada com sucesso',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      description:
        'Requisição inválida - Token inválido ou erro de validação de senha',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          enum: [
            'Token de recuperação inválido',
            'A senha deve ter no mínimo 6 caracteres',
            'A senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 especial',
          ],
        },
        code: { type: 'number', enum: [400] },
        cause: {
          type: 'string',
          enum: ['INVALID_TOKEN', 'INVALID_PARAMETERS'],
        },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Token de recuperação inválido',
          code: 400,
          cause: 'INVALID_TOKEN',
        },
        {
          message: 'A senha deve ter no mínimo 6 caracteres',
          code: 400,
          cause: 'INVALID_PARAMETERS',
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
        cause: { type: 'string', enum: ['UPDATE_PASSWORD_ERROR'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Erro interno do servidor',
          code: 500,
          cause: 'UPDATE_PASSWORD_ERROR',
        },
      ],
    },
  },
};
