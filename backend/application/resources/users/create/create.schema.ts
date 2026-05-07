import type { FastifySchema } from 'fastify';

export const UserCreateSchema: FastifySchema = {
  tags: ['Users'],
  summary: 'Create a new user',
  description:
    'Creates a new user account with name, email, password and a role',
  security: [{ cookieAuth: [] }],
  body: {
    type: 'object',
    required: ['name', 'email', 'password', 'role'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        description: 'User full name',
        errorMessage: {
          type: 'O nome deve ser um texto',
          minLength: 'O nome é obrigatório',
        },
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
        errorMessage: {
          type: 'O email deve ser um texto',
          format: 'Digite um email válido',
        },
      },
      password: {
        type: 'string',
        minLength: 6,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])',
        description: 'User password',
        errorMessage: {
          type: 'A senha deve ser um texto',
          minLength: 'A senha deve ter no mínimo 6 caracteres',
          pattern:
            'A senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 especial',
        },
      },
      role: {
        type: 'string',
        enum: ['MASTER', 'ADMINISTRATOR'],
        description: 'User role',
        errorMessage: {
          type: 'O role deve ser um texto',
          enum: 'O role deve ser MASTER ou ADMINISTRATOR',
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: {
        name: 'O nome é obrigatório',
        email: 'O email é obrigatório',
        password: 'A senha é obrigatória',
        role: 'O role é obrigatório',
      },
      additionalProperties: 'Campos extras não são permitidos',
    },
  },
  response: {
    201: {
      description: 'User created successfully',
      type: 'object',
      properties: {
        _id: { type: 'string', description: 'User ID' },
        name: { type: 'string', description: 'User full name' },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email',
        },
        role: { type: 'string', description: 'User role' },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE'],
          description: 'User status',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    400: {
      description: 'Bad request - Validation failed',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Specific validation error',
        },
        code: { type: 'number', enum: [400] },
        cause: {
          type: 'string',
          enum: ['INVALID_PAYLOAD_FORMAT'],
        },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Field-specific validation errors',
        },
      },
    },
    401: {
      description: 'Unauthorized - Authentication required',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Unauthorized'] },
        code: { type: 'number', enum: [401] },
        cause: { type: 'string', enum: ['AUTHENTICATION_REQUIRED'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
    },
    409: {
      description: 'Conflict - User with this email already exists',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['User already exists'] },
        code: { type: 'number', enum: [409] },
        cause: { type: 'string', enum: ['USER_ALREADY_EXISTS'] },
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
        cause: { type: 'string', enum: ['CREATE_USER_ERROR'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
    },
  },
};
