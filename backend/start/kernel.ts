import 'reflect-metadata';

import { loadControllers } from '@application/core/controllers';
import { registerDependencies } from '@application/core/di-registry';
import HTTPException from '@application/core/exception.core';
import { StorageContractRepository } from '@application/repositories/storage/storage-contract.repository';
import StorageDrizzleRepository from '@application/repositories/storage/storage-drizzle.repository';
import {
  buildContentDisposition,
  type DispositionMode,
} from '@application/services/storage/content-disposition';
import {
  getCachedStorageMeta,
  setCachedStorageMeta,
  type StorageMeta,
} from '@application/services/storage/storage-meta-cache';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getLocalStoragePath, getS3Client } from '@config/storage.config';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import scalar from '@scalar/fastify-api-reference';
import { Env } from '@start/env';
import ajv from 'ajv-errors';
import fastify from 'fastify';
import { bootstrap, getInstanceByToken } from 'fastify-decorators';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import z, { ZodError } from 'zod';

function matchOrigin(origin: string, pattern: string): boolean {
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(1);
    try {
      const url = new URL(origin);
      return url.hostname.endsWith(suffix) && url.hostname !== suffix.slice(1);
    } catch {
      return false;
    }
  }
  return origin === pattern;
}

interface ValidationErrorDetail {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: {
    limit?: number;
    missingProperty?: string;
    [key: string]: unknown;
  };
  message: string;
  emUsed?: boolean;
}

interface ValidationError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: {
    errors: ValidationErrorDetail[];
  };
  message: string;
}

const kernel = fastify({
  logger: false,
  ajv: {
    customOptions: {
      allErrors: true,
    },
    // ajv-errors is `Plugin<ErrorMessageOptions>` while fastify expects
    // `Plugin<unknown>` — variance gap fastify can't bridge in types.
    // @ts-expect-error variance gap with ajv-errors typings
    plugins: [ajv],
  },
});

function checkOriginAllowed(origin: string): boolean {
  const fixedOrigins = [Env.APPLICATION_CLIENT_URL, Env.APPLICATION_SERVER_URL];
  if (fixedOrigins.includes(origin)) return true;
  return Env.ALLOWED_ORIGINS.some((pattern): boolean =>
    matchOrigin(origin, pattern),
  );
}

kernel.register(cors, {
  origin: (origin, callback): void => {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (checkOriginAllowed(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'X-Timezone',
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  preflight: true,
});

kernel.register(cookie, {
  secret: Env.COOKIE_SECRET,
});

const expiresIn = 60 * 60 * 24 * 1; // 1 day

kernel.register(jwt, {
  secret: {
    private: Buffer.from(Env.JWT_PRIVATE_KEY, 'base64'),
    public: Buffer.from(Env.JWT_PUBLIC_KEY, 'base64'),
  },
  sign: { expiresIn: expiresIn, algorithm: 'RS256' },
  verify: { algorithms: ['RS256'] },
  cookie: {
    signed: false,
    cookieName: 'accessToken',
  },
});

kernel.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});

const DISPOSITION_MAP: Record<string, DispositionMode> = {
  '1': 'attachment',
  true: 'attachment',
  attachment: 'attachment',
};

function resolveDisposition(download: string | null): DispositionMode {
  if (download === null) return 'inline';
  return DISPOSITION_MAP[download] ?? 'inline';
}

async function resolveStorageMeta(
  filename: string,
): Promise<StorageMeta | null> {
  const cached = getCachedStorageMeta(filename);
  if (cached !== undefined) return cached;

  try {
    const repo = getInstanceByToken<StorageContractRepository>(
      StorageDrizzleRepository,
    );
    const doc = await repo.findByFilename(filename);
    let meta: StorageMeta | null = null;
    if (doc !== null) {
      meta = {
        originalName: doc.originalName,
        mimetype: doc.mimetype,
        location: doc.location,
      };
    }
    setCachedStorageMeta(filename, meta);
    return meta;
  } catch (error) {
    console.error('[Storage] Falha ao buscar metadata:', error);
    return null;
  }
}

const HASH_NAME_PATTERN = /^\d{1,8}$/;

function isStaticFilename(filename: string): boolean {
  const dotIndex = filename.lastIndexOf('.');
  let stem = filename;
  if (dotIndex !== -1) stem = filename.slice(0, dotIndex);
  return !HASH_NAME_PATTERN.test(stem);
}

const STATIC_CACHE_CONTROL = 'no-cache, must-revalidate';
const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

interface StorageRequest {
  headers: Record<string, string | string[] | undefined>;
}

interface StorageReply {
  header(name: string, value: string | number): StorageReply;
  send(body?: unknown): StorageReply;
  status(code: number): StorageReply;
}

async function serveFromLocal(
  filename: string,
  request: StorageRequest,
  reply: StorageReply,
): Promise<void> {
  const fullPath = join(getLocalStoragePath(), filename);
  if (!existsSync(fullPath)) {
    throw new Error(`[Storage Local] File not found: ${filename}`);
  }
  const stats = statSync(fullPath);

  if (isStaticFilename(filename)) {
    const etag = `"${stats.mtimeMs.toString(36)}-${stats.size.toString(36)}"`;
    reply.header('etag', etag);
    reply.header('last-modified', stats.mtime.toUTCString());
    reply.header('cache-control', STATIC_CACHE_CONTROL);

    const ifNoneMatch = request.headers['if-none-match'];
    if (ifNoneMatch === etag) {
      reply.status(304).send();
      return;
    }
  }
  if (!isStaticFilename(filename)) {
    reply.header('cache-control', IMMUTABLE_CACHE_CONTROL);
  }

  reply.header('content-length', stats.size);
  reply.send(createReadStream(fullPath));
}

async function serveFromS3(
  filename: string,
  _request: StorageRequest,
  reply: StorageReply,
): Promise<void> {
  const bucket = Env.STORAGE_BUCKET;
  if (!bucket) {
    throw new Error('STORAGE_BUCKET not configured');
  }
  const response = await getS3Client().send(
    new GetObjectCommand({ Bucket: bucket, Key: filename }),
  );

  let contentType = 'application/octet-stream';
  if (response.ContentType) contentType = response.ContentType;
  reply.header('content-type', contentType);

  if (isStaticFilename(filename)) {
    reply.header('cache-control', STATIC_CACHE_CONTROL);
    if (response.ETag) reply.header('etag', response.ETag);
    if (response.LastModified) {
      reply.header('last-modified', response.LastModified.toUTCString());
    }
  }
  if (!isStaticFilename(filename)) {
    reply.header('cache-control', IMMUTABLE_CACHE_CONTROL);
  }

  if (response.ContentLength) {
    reply.header('content-length', response.ContentLength);
  }

  reply.send(response.Body);
}

const DRIVER_HANDLERS = {
  local: serveFromLocal,
  s3: serveFromS3,
} as const;

// inferred return: Promise<FastifyReply | void>
kernel.addHook('onRequest', async (request, reply) => {
  if (!request.url.startsWith('/storage/')) return;
  if (request.method !== 'GET' && request.method !== 'HEAD') return;

  const [rawPath, rawQuery] = request.url.split('?');
  const filename = decodeURIComponent(rawPath.replace('/storage/', ''));
  if (!filename || filename.includes('..') || filename.includes('/')) {
    reply.status(400).send({ message: 'Nome de arquivo inválido' });
    return reply;
  }

  const query = new URLSearchParams(rawQuery ?? '');
  const mode = resolveDisposition(query.get('download'));

  const meta = await resolveStorageMeta(filename);
  if (meta !== null) {
    reply.header(
      'content-disposition',
      buildContentDisposition(mode, meta.originalName),
    );
  }

  let driver = Env.STORAGE_DRIVER;
  if (meta?.location) driver = meta.location;

  try {
    await DRIVER_HANDLERS[driver](filename, request, reply);
  } catch (err) {
    let message = 'unknown error';
    if (err instanceof Error) message = err.message;
    console.info(
      `[Storage] ${filename} ausente no driver ${driver}: ${message}`,
    );
    reply.status(404).send({ message: 'Arquivo não encontrado' });
  }
  return reply;
});

// inferred return: FastifyReply | undefined
kernel.setErrorHandler((error: Record<string, unknown>, request, response) => {
  if (error instanceof HTTPException) {
    return response.status(error.code).send({
      message: error.message,
      code: error.code,
      cause: error.cause,
      ...(error.errors && { errors: error.errors }),
    });
  }

  if (error instanceof ZodError) {
    const flat = z.flattenError(error);
    const fieldErrors: Record<string, string> = {};
    for (const [key, list] of Object.entries(flat.fieldErrors)) {
      if (Array.isArray(list) && list.length > 0) {
        fieldErrors[key] = String(list[0]);
      }
    }

    return response.status(400).send({
      message: 'Requisição inválida',
      code: 400,
      cause: 'INVALID_PAYLOAD_FORMAT',
      errors: fieldErrors,
    });
  }

  if (error.code === 'FST_ERR_VALIDATION' && Array.isArray(error.validation)) {
    const errors: Record<string, string> = {};
    for (const raw of error.validation) {
      if (!raw || typeof raw !== 'object') continue;
      const err: ValidationError = {
        instancePath: '',
        schemaPath: '',
        keyword: '',
        params: { errors: [] },
        message: '',
      };
      if ('instancePath' in raw && typeof raw.instancePath === 'string') {
        err.instancePath = raw.instancePath;
      }
      if ('schemaPath' in raw && typeof raw.schemaPath === 'string') {
        err.schemaPath = raw.schemaPath;
      }
      if ('keyword' in raw && typeof raw.keyword === 'string') {
        err.keyword = raw.keyword;
      }
      if ('message' in raw && typeof raw.message === 'string') {
        err.message = raw.message;
      }
      if (
        'params' in raw &&
        raw.params &&
        typeof raw.params === 'object' &&
        'errors' in raw.params &&
        Array.isArray(raw.params.errors)
      ) {
        const innerErrors: ValidationErrorDetail[] = [];
        for (const item of raw.params.errors) {
          if (item && typeof item === 'object') {
            const detail: ValidationErrorDetail = {
              instancePath: '',
              schemaPath: '',
              keyword: '',
              params: {},
              message: '',
            };
            if (
              'params' in item &&
              item.params &&
              typeof item.params === 'object' &&
              'missingProperty' in item.params &&
              typeof item.params.missingProperty === 'string'
            ) {
              detail.params.missingProperty = item.params.missingProperty;
            }
            innerErrors.push(detail);
          }
        }
        err.params.errors = innerErrors;
      }
      let field = 'unknown';
      if (err.instancePath) field = err.instancePath.slice(1);
      if (
        !err.instancePath &&
        err.params?.errors?.[0]?.params?.missingProperty
      ) {
        field = err.params.errors[0].params.missingProperty;
      }
      if (err.message && field) errors[field] = err.message;
    }

    const result: Record<string, unknown> = {
      message: 'Requisição inválida',
      code: error.statusCode,
      cause: 'INVALID_PAYLOAD_FORMAT',
    };
    if (Object.keys(errors).length > 0) result.errors = errors;
    return response.status(Number(error.statusCode)).send(result);
  }

  console.error(error);

  return response.status(500).send({
    message: 'Erro interno do servidor',
    cause: 'SERVER_ERROR',
    code: 500,
  });
});

kernel.register(swagger, {
  openapi: {
    info: {
      title: 'SGBDIO API',
      version: '1.0.0',
      description: 'SGBDIO API with JWT cookie-based authentication',
    },
    servers: [
      {
        url: Env.APPLICATION_SERVER_URL,
        description: 'Base URL',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
  },
});

kernel.register(scalar, {
  routePrefix: '/documentation',
  configuration: {
    title: 'SGBDIO API',
    theme: 'default',
  },
});

registerDependencies();

kernel.register(bootstrap, {
  controllers: [...(await loadControllers())],
});

kernel.get('/openapi.json', async function (): Promise<unknown> {
  return kernel.swagger();
});

export { kernel };
