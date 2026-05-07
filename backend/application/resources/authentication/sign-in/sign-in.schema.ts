import type { FastifySchema } from 'fastify';

export const SignInSchema: FastifySchema = {
  tags: ['Autenticação'],
  summary: 'User authentication sign in',
  description:
    'Authenticates a user with email and password, returning JWT tokens as HTTP-only cookies',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        errorMessage: {
          type: 'O email deve ser um texto',
          format: 'Digite um email válido',
        },
      },
      password: {
        type: 'string',
        minLength: 1,
        errorMessage: {
          type: 'A senha deve ser um texto',
          minLength: 'A senha é obrigatória',
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        email: 'O email é obrigatório',
        password: 'A senha é obrigatória',
      },
      additionalProperties: 'Campos extras não são permitidos',
    },
  },
  response: {
    200: {
      description:
        'Successful authentication - Sets httpOnly cookies for accessToken and refreshToken',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Authentication successful'] },
      },
      headers: {
        'Set-Cookie': {
          type: 'string',
          description: 'Authentication cookies (accessToken, refreshToken)',
        },
      },
    },
    400: {
      description: 'Bad request - Validation failed',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Invalid request'] },
        code: { type: 'number', enum: [400] },
        cause: { type: 'string', enum: ['INVALID_PAYLOAD_FORMAT'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Field-specific validation errors',
        },
      },
    },
    401: {
      description: 'Unauthorized - Invalid credentials or inactive user',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          enum: ['Credenciais invalidas', 'Usuário inativo'],
        },
        code: { type: 'number', enum: [401] },
        cause: {
          type: 'string',
          enum: [
            'INVALID_CREDENTIALS',
            'USER_INACTIVE',
            'AUTHENTICATION_REQUIRED',
          ],
        },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
    },
    500: {
      description: 'Internal server error - Database or server issues',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Internal server error'] },
        code: { type: 'number', enum: [500] },
        cause: { type: 'string', enum: ['SIGN_IN_ERROR'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
    },
  },
};
