import 'reflect-metadata';

import { config } from 'dotenv';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach } from 'vitest';

import {
  connectDatabase,
  disconnectDatabase,
  getDb,
  runMigrations,
} from '@config/database.config';

config({ path: '.env.test', override: true });

beforeAll(async (): Promise<void> => {
  await connectDatabase();
  await runMigrations();
});

beforeEach(async (): Promise<void> => {
  const db = getDb();
  await db.execute(
    sql`TRUNCATE TABLE validation_tokens, storage, users RESTART IDENTITY CASCADE`,
  );
});

afterAll(async (): Promise<void> => {
  await disconnectDatabase();
});
