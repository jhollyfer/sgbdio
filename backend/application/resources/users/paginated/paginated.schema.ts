import type { FastifySchema } from 'fastify';

export const UserPaginatedSchema: FastifySchema = {
  tags: ['Users'],
  summary: 'List users with pagination',
  description:
    'Retrieves a paginated list of users with optional search functionality',
  security: [{ cookieAuth: [] }],
  querystring: {
    type: 'object',
    properties: {
      page: {
        type: 'number',
        minimum: 1,
        default: 1,
        description: 'Page number (starts from 1)',
        examples: [1, 2, 5],
      },
      perPage: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 50,
        description: 'Number of items per page (max 100)',
        examples: [10, 25, 50, 100],
      },
      search: {
        type: 'string',
        minLength: 1,
        description:
          'Search term for filtering users by name or email (optional)',
        examples: ['john', 'john@example.com', 'doe'],
      },
      status: {
        type: 'string',
        enum: ['ACTIVE', 'INACTIVE'],
        description: 'Filter returned users by status (optional)',
      },
      trashed: {
        type: 'string',
        enum: ['true', 'false'],
        description:
          'Filter users by trash state. true = trashed only, false = active only (default).',
        examples: ['true', 'false'],
      },
      role: {
        type: 'string',
        enum: ['MASTER', 'ADMINISTRATOR'],
        description:
          'Query context role. When ADMINISTRATOR, backend applies admin scope rules (hides MASTER users). JWT confirms authorization.',
      },
      'order-name': {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Ordenar por nome',
      },
      'order-email': {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Ordenar por e-mail',
      },
      'order-role': {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Ordenar por role',
      },
      'order-status': {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Ordenar por status',
      },
      'order-created-at': {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Ordenar por data de criacao',
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Paginated list of users',
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              status: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            perPage: { type: 'number' },
            page: { type: 'number' },
            lastPage: { type: 'number' },
            firstPage: { type: 'number' },
          },
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
      examples: [
        {
          message: 'Unauthorized',
          code: 401,
          cause: 'AUTHENTICATION_REQUIRED',
        },
      ],
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string', enum: ['Internal server error'] },
        code: { type: 'number', enum: [500] },
        cause: { type: 'string', enum: ['LIST_USER_PAGINATED_ERROR'] },
        errors: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
      examples: [
        {
          message: 'Internal server error',
          code: 500,
          cause: 'LIST_USER_PAGINATED_ERROR',
        },
      ],
    },
  },
};
