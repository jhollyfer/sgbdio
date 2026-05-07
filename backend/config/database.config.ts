import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { join } from 'node:path';
import pg from 'pg';

import * as schema from '@database/schema';
import { Env } from '@start/env';

let pool: pg.Pool | null = null;
let dbInstance: NodePgDatabase<typeof schema> | null = null;

export type Database = NodePgDatabase<typeof schema>;

export function getPool(): pg.Pool {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return pool;
}

export function getDb(): Database {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return dbInstance;
}

export async function connectDatabase(): Promise<void> {
  pool = new pg.Pool({ connectionString: Env.DATABASE_URL });
  dbInstance = drizzle(pool, { schema });
}

export async function runMigrations(): Promise<void> {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  await migrate(dbInstance, {
    migrationsFolder: join(process.cwd(), 'database', 'migrations'),
  });
}

export async function disconnectDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    dbInstance = null;
  }
}
