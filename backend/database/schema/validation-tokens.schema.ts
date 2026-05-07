import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from './users.schema';

export const validationTokens = pgTable('validation_tokens', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references((): typeof users.id => users.id, { onDelete: 'cascade' }),
  code: varchar('code', { length: 255 }).notNull(),
  status: varchar('status', {
    length: 32,
    enum: ['REQUESTED', 'EXPIRED', 'VALIDATED'],
  })
    .notNull()
    .default('REQUESTED'),
  trashed: boolean('trashed').notNull().default(false),
  trashedAt: timestamp('trashed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ValidationTokenRow = typeof validationTokens.$inferSelect;
export type ValidationTokenInsert = typeof validationTokens.$inferInsert;
