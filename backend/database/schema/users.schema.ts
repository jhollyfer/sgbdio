import {
  boolean,
  pgTable,
  type PgTableExtraConfigValue,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    role: varchar('role', {
      length: 32,
      enum: ['MASTER', 'ADMINISTRATOR'],
    }).notNull(),
    status: varchar('status', {
      length: 32,
      enum: ['ACTIVE', 'INACTIVE'],
    })
      .notNull()
      .default('ACTIVE'),
    trashed: boolean('trashed').notNull().default(false),
    trashedAt: timestamp('trashed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table): PgTableExtraConfigValue[] => [
    uniqueIndex('users_email_unique').on(table.email),
  ],
);

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
