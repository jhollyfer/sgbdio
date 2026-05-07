import { relations } from 'drizzle-orm';

import { storage } from './storage.schema';
import { users } from './users.schema';
import { validationTokens } from './validation-tokens.schema';

export { storage, users, validationTokens };
export type { StorageInsert, StorageRow } from './storage.schema';
export type { UserInsert, UserRow } from './users.schema';
export type {
  ValidationTokenInsert,
  ValidationTokenRow,
} from './validation-tokens.schema';

// inferred return: Relations<'users', { validationTokens: Many<'validation_tokens'> }>
export const usersRelations = relations(users, ({ many }) => {
  return { validationTokens: many(validationTokens) };
});

// inferred return: Relations<'validation_tokens', { user: One<'users', true> }>
export const validationTokensRelations = relations(
  validationTokens,
  ({ one }) => {
    return {
      user: one(users, {
        fields: [validationTokens.userId],
        references: [users.id],
      }),
    };
  },
);
