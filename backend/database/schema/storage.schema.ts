import {
  bigint,
  boolean,
  pgTable,
  type PgTableExtraConfigValue,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const storage = pgTable(
  'storage',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    filename: varchar('filename', { length: 255 }).notNull(),
    mimetype: varchar('mimetype', { length: 128 }).notNull(),
    originalName: varchar('original_name', { length: 512 }).notNull(),
    size: bigint('size', { mode: 'number' }).notNull(),
    location: varchar('location', {
      length: 16,
      enum: ['local', 's3'],
    })
      .notNull()
      .default('local'),
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
    uniqueIndex('storage_filename_unique').on(table.filename),
  ],
);

export type StorageRow = typeof storage.$inferSelect;
export type StorageInsert = typeof storage.$inferInsert;
