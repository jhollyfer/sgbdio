import { config } from 'dotenv';
import { z } from 'zod';

let envFile = '.env';
if (process.env.NODE_ENV === 'test') envFile = '.env.test';
config({ path: envFile });

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().trim(),

  JWT_PUBLIC_KEY: z.string().trim(),
  JWT_PRIVATE_KEY: z.string().trim(),

  COOKIE_SECRET: z.string().trim(),
  COOKIE_DOMAIN: z.string().trim().optional(),

  APPLICATION_SERVER_URL: z.string().trim(),
  APPLICATION_CLIENT_URL: z.string().trim(),

  ALLOWED_ORIGINS: z
    .string()
    .default('http://127.0.0.1')
    .transform((val): string[] =>
      val
        .split(';')
        .map((s): string => s.trim())
        .filter(Boolean),
    ),

  REDIS_URL: z.string().trim().default('redis://localhost:6379'),

  EMAIL_PROVIDER_HOST: z.string().trim().optional(),
  EMAIL_PROVIDER_PORT: z.coerce.number().int().optional(),
  EMAIL_PROVIDER_USER: z.string().trim().optional(),
  EMAIL_PROVIDER_PASSWORD: z.string().trim().optional(),
  EMAIL_PROVIDER_FROM: z.string().trim().optional(),
  EMAIL_WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(50).default(5),

  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  STORAGE_ENDPOINT: z.string().trim().optional(),
  STORAGE_REGION: z.string().trim().optional(),
  STORAGE_BUCKET: z.string().trim().optional(),
  STORAGE_ACCESS_KEY: z.string().trim().optional(),
  STORAGE_SECRET_KEY: z.string().trim().optional(),

  BOOTSTRAP_MASTER_EMAIL: z.string().trim().email().optional(),
  BOOTSTRAP_MASTER_PASSWORD: z.string().trim().min(1).optional(),
  BOOTSTRAP_MASTER_NAME: z.string().trim().optional(),
});

const validation = EnvSchema.safeParse(process.env);

if (!validation.success) {
  console.error('Invalid environment variables', validation.error.issues);
  throw new Error('Invalid environment variables');
}

export const Env = validation.data;
