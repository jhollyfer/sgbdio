import {
  and,
  asc,
  count as countFn,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  or,
  type SQL,
} from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { Service } from 'fastify-decorators';

import type { FindOptions, IUser } from '@application/core/entity.core';
import { Role } from '@application/core/role.core';
import { getDb } from '@config/database.config';
import { users, type UserRow } from '@database/schema';

import {
  UserContractRepository,
  type UserCreatePayload,
  type UserQueryPayload,
  type UserUpdateManyPayload,
  type UserUpdatePayload,
} from './user-contract.repository';

function pickSortColumn(key: string): PgColumn | undefined {
  if (key === 'name') return users.name;
  if (key === 'email') return users.email;
  if (key === 'role') return users.role;
  if (key === 'status') return users.status;
  if (key === 'createdAt') return users.createdAt;
  if (key === 'updatedAt') return users.updatedAt;
  return undefined;
}

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

function buildWhere(payload?: UserQueryPayload): SQL | undefined {
  const conditions: SQL[] = [];

  let trashedFilter = false;
  if (payload?.trashed !== undefined) trashedFilter = payload.trashed;
  conditions.push(eq(users.trashed, trashedFilter));

  if (payload?._ids && payload._ids.length > 0) {
    conditions.push(inArray(users.id, payload._ids));
  }

  if (payload?.status) {
    conditions.push(eq(users.status, payload.status));
  }

  if (payload?.role) {
    conditions.push(eq(users.role, payload.role));
  }

  if (
    payload?.role === Role.ADMINISTRATOR &&
    payload?.user?.role === Role.ADMINISTRATOR
  ) {
    conditions.push(ne(users.role, Role.MASTER));
  }

  if (payload?.search) {
    const term = `%${payload.search}%`;
    const searchClause = or(ilike(users.name, term), ilike(users.email, term));
    if (searchClause) conditions.push(searchClause);
  }

  if (conditions.length === 0) return undefined;
  return and(...conditions);
}

function buildOrderBy(sort?: Record<string, 'asc' | 'desc'>): SQL[] {
  const entries = Object.entries(sort ?? {});
  if (entries.length === 0) return [asc(users.name)];

  const orderBy: SQL[] = [];
  for (const [key, direction] of entries) {
    const column = pickSortColumn(key);
    if (!column) continue;
    if (direction === 'asc') orderBy.push(asc(column));
    if (direction === 'desc') orderBy.push(desc(column));
  }
  if (orderBy.length === 0) return [asc(users.name)];
  return orderBy;
}

@Service()
export default class UserDrizzleRepository implements UserContractRepository {
  async create(payload: UserCreatePayload): Promise<IUser> {
    const db = getDb();
    const [row] = await db
      .insert(users)
      .values({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        status: payload.status ?? 'INACTIVE',
      })
      .returning();
    return rowToUser(row);
  }

  async findById(_id: string, options?: FindOptions): Promise<IUser | null> {
    const db = getDb();
    const conditions: SQL[] = [eq(users.id, _id)];
    if (options?.trashed !== undefined) {
      conditions.push(eq(users.trashed, options.trashed));
    }
    const [row] = await db
      .select()
      .from(users)
      .where(and(...conditions))
      .limit(1);
    if (!row) return null;
    return rowToUser(row);
  }

  async findByEmail(
    email: string,
    options?: FindOptions,
  ): Promise<IUser | null> {
    const db = getDb();
    const conditions: SQL[] = [eq(users.email, email)];
    if (options?.trashed !== undefined) {
      conditions.push(eq(users.trashed, options.trashed));
    }
    const [row] = await db
      .select()
      .from(users)
      .where(and(...conditions))
      .limit(1);
    if (!row) return null;
    return rowToUser(row);
  }

  async findMany(payload?: UserQueryPayload): Promise<IUser[]> {
    const db = getDb();
    const where = buildWhere(payload);
    const orderBy = buildOrderBy(payload?.sort);

    let query = db.select().from(users).$dynamic();
    if (where) query = query.where(where);
    query = query.orderBy(...orderBy);

    if (payload?.page && payload?.perPage) {
      const offset = (payload.page - 1) * payload.perPage;
      query = query.limit(payload.perPage).offset(offset);
    }

    const rows = await query;
    return rows.map((row): IUser => rowToUser(row));
  }

  async findManyTrashed(): Promise<IUser[]> {
    const db = getDb();
    const rows = await db.select().from(users).where(eq(users.trashed, true));
    return rows.map((row): IUser => rowToUser(row));
  }

  async update({ _id, ...payload }: UserUpdatePayload): Promise<IUser> {
    const db = getDb();
    const [row] = await db
      .update(users)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(users.id, _id))
      .returning();
    if (!row) throw new Error('User not found');
    return rowToUser(row);
  }

  async updateMany({
    _ids,
    filterTrashed,
    data,
  }: UserUpdateManyPayload): Promise<number> {
    if (_ids.length === 0) return 0;
    const db = getDb();
    const conditions: SQL[] = [inArray(users.id, _ids)];
    if (filterTrashed !== undefined) {
      conditions.push(eq(users.trashed, filterTrashed));
    }

    const updateData: {
      trashed?: boolean;
      trashedAt?: Date | null;
      updatedAt: Date;
    } = { updatedAt: new Date() };
    if (data.trashed !== undefined) updateData.trashed = data.trashed;
    if (data.trashedAt !== undefined) updateData.trashedAt = data.trashedAt;

    const result = await db
      .update(users)
      .set(updateData)
      .where(and(...conditions))
      .returning({ id: users.id });
    return result.length;
  }

  async delete(_id: string): Promise<void> {
    const db = getDb();
    await db.delete(users).where(eq(users.id, _id));
  }

  async deleteMany(_ids: string[]): Promise<number> {
    if (_ids.length === 0) return 0;
    const db = getDb();
    const result = await db
      .delete(users)
      .where(inArray(users.id, _ids))
      .returning({ id: users.id });
    return result.length;
  }

  async count(payload?: UserQueryPayload): Promise<number> {
    const db = getDb();
    const where = buildWhere(payload);
    let query = db.select({ value: countFn() }).from(users).$dynamic();
    if (where) query = query.where(where);
    const [row] = await query;
    return row?.value ?? 0;
  }
}
