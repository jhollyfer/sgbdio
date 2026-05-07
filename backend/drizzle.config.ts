import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

let envFile = '.env';
if (process.env.NODE_ENV === 'test') envFile = '.env.test';
config({ path: envFile });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

export default defineConfig({
  schema: './database/schema/index.ts',
  out: './database/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
