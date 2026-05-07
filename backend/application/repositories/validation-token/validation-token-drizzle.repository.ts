import { and, count as countFn, desc, eq, type SQL } from 'drizzle-orm';
import { Service } from 'fastify-decorators';

import type {
  FindOptions,
  IUser,
  IValidationToken,
} from '@application/core/entity.core';
import { getDb } from '@config/database.config';
import {
  users,
  validationTokens,
  type UserRow,
  type ValidationTokenRow,
} from '@database/schema';

import {
  ValidationTokenContractRepository,
  type ValidationTokenCreatePayload,
  type ValidationTokenQueryPayload,
  type ValidationTokenUpdatePayload,
} from './validation-token-contract.repository';

function rowToUser(row: UserRow): IUser {
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    status: row.status,
    trashed: row.trashed,
    trashedAt: row.trashedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function rowToToken(
  token: ValidationTokenRow,
  user: UserRow,
): IValidationToken {
  return {
    _id: token.id,
    user: rowToUser(user),
    code: token.code,
    status: token.status,
    trashed: token.trashed,
    trashedAt: token.trashedAt,
    createdAt: token.createdAt,
    updatedAt: token.updatedAt,
  };
}

function buildWhere(payload?: ValidationTokenQueryPayload): SQL | undefined {
  const conditions: SQL[] = [eq(validationTokens.trashed, false)];

  if (payload?.user) {
    conditions.push(eq(validationTokens.userId, payload.user));
  }

  if (payload?.status) {
    conditions.push(eq(validationTokens.status, payload.status));
  }

  if (conditions.length === 0) return undefined;
  return and(...conditions);
}

@Service()
export default class ValidationTokenDrizzleRepository implements ValidationTokenContractRepository {
  async create(
    payload: ValidationTokenCreatePayload,
  ): Promise<IValidationToken> {
    const db = getDb();
    const [token] = await db
      .insert(validationTokens)
      .values({
        userId: payload.user,
        code: payload.code,
        status: payload.status,
      })
      .returning();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, token.userId))
      .limit(1);
    if (!user) throw new Error('User not found for validation token');
    return rowToToken(token, user);
  }

  async findById(
    _id: string,
    options?: FindOptions,
  ): Promise<IValidationToken | null> {
    const db = getDb();
    const conditions: SQL[] = [eq(validationTokens.id, _id)];
    if (options?.trashed !== undefined) {
      conditions.push(eq(validationTokens.trashed, options.trashed));
    }
    const [pair] = await db
      .select()
      .from(validationTokens)
      .innerJoin(users, eq(users.id, validationTokens.userId))
      .where(and(...conditions))
      .limit(1);
    if (!pair) return null;
    return rowToToken(pair.validation_tokens, pair.users);
  }

  async findByCode(
    code: string,
    options?: FindOptions,
  ): Promise<IValidationToken | null> {
    const db = getDb();
    const conditions: SQL[] = [eq(validationTokens.code, code)];
    if (options?.trashed !== undefined) {
      conditions.push(eq(validationTokens.trashed, options.trashed));
    }
    const [pair] = await db
      .select()
      .from(validationTokens)
      .innerJoin(users, eq(users.id, validationTokens.userId))
      .where(and(...conditions))
      .limit(1);
    if (!pair) return null;
    return rowToToken(pair.validation_tokens, pair.users);
  }

  async findMany(
    payload?: ValidationTokenQueryPayload,
  ): Promise<IValidationToken[]> {
    const db = getDb();
    const where = buildWhere(payload);

    let query = db
      .select()
      .from(validationTokens)
      .innerJoin(users, eq(users.id, validationTokens.userId))
      .$dynamic();
    if (where) query = query.where(where);
    query = query.orderBy(desc(validationTokens.createdAt));

    if (payload?.page && payload?.perPage) {
      const offset = (payload.page - 1) * payload.perPage;
      query = query.limit(payload.perPage).offset(offset);
    }

    const rows = await query;
    return rows.map(
      (pair): IValidationToken =>
        rowToToken(pair.validation_tokens, pair.users),
    );
  }

  async update({
    _id,
    user: userId,
    ...rest
  }: ValidationTokenUpdatePayload): Promise<IValidationToken> {
    const db = getDb();
    const updateData: {
      code?: string;
      status?: ValidationTokenRow['status'];
      userId?: string;
      updatedAt: Date;
    } = { updatedAt: new Date() };
    if (rest.code !== undefined) updateData.code = rest.code;
    if (rest.status !== undefined) updateData.status = rest.status;
    if (userId !== undefined) updateData.userId = userId;

    const [token] = await db
      .update(validationTokens)
      .set(updateData)
      .where(eq(validationTokens.id, _id))
      .returning();
    if (!token) throw new Error('Validation token not found');
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, token.userId))
      .limit(1);
    if (!user) throw new Error('User not found for validation token');
    return rowToToken(token, user);
  }

  async delete(_id: string): Promise<void> {
    const db = getDb();
    await db.delete(validationTokens).where(eq(validationTokens.id, _id));
  }

  async count(payload?: ValidationTokenQueryPayload): Promise<number> {
    const db = getDb();
    const where = buildWhere(payload);
    let query = db
      .select({ value: countFn() })
      .from(validationTokens)
      .$dynamic();
    if (where) query = query.where(where);
    const [row] = await query;
    return row?.value ?? 0;
  }
}
