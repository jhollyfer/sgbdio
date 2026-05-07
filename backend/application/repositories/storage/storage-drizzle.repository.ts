import type { FindOptions, IStorage } from '@application/core/entity.core';
import { getDb } from '@config/database.config';
import { storage, type StorageRow } from '@database/schema';
import { Env } from '@start/env';
import {
  and,
  asc,
  count as countFn,
  eq,
  ilike,
  or,
  type SQL,
} from 'drizzle-orm';
import { Service } from 'fastify-decorators';

import {
  StorageContractRepository,
  type StorageCreatePayload,
  type StorageQueryPayload,
  type StorageUpdatePayload,
} from './storage-contract.repository';

function buildStorageUrl(filename: string): string {
  return Env.APPLICATION_SERVER_URL.concat('/storage/').concat(filename);
}

function rowToStorage(row: StorageRow): IStorage {
  return {
    _id: row.id,
    url: buildStorageUrl(row.filename),
    filename: row.filename,
    mimetype: row.mimetype,
    originalName: row.originalName,
    size: row.size,
    location: row.location,
    trashed: row.trashed,
    trashedAt: row.trashedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function buildWhere(payload?: StorageQueryPayload): SQL | undefined {
  const conditions: SQL[] = [eq(storage.trashed, false)];

  if (payload?.mimetype) {
    conditions.push(eq(storage.mimetype, payload.mimetype));
  }

  if (payload?.search) {
    const term = `%${payload.search}%`;
    const searchClause = or(
      ilike(storage.filename, term),
      ilike(storage.originalName, term),
    );
    if (searchClause) conditions.push(searchClause);
  }

  if (conditions.length === 0) return undefined;
  return and(...conditions);
}

@Service()
export default class StorageDrizzleRepository implements StorageContractRepository {
  async create(payload: StorageCreatePayload): Promise<IStorage> {
    const db = getDb();
    const [row] = await db
      .insert(storage)
      .values({
        filename: payload.filename,
        mimetype: payload.mimetype,
        originalName: payload.originalName,
        size: payload.size,
        location: payload.location ?? Env.STORAGE_DRIVER,
      })
      .returning();
    return rowToStorage(row);
  }

  async createMany(payloads: StorageCreatePayload[]): Promise<IStorage[]> {
    if (payloads.length === 0) return [];
    const db = getDb();
    const rows = await db
      .insert(storage)
      .values(
        payloads.map((p): typeof storage.$inferInsert => ({
          filename: p.filename,
          mimetype: p.mimetype,
          originalName: p.originalName,
          size: p.size,
          location: p.location ?? Env.STORAGE_DRIVER,
        })),
      )
      .returning();
    return rows.map((row): IStorage => rowToStorage(row));
  }

  async findById(_id: string, options?: FindOptions): Promise<IStorage | null> {
    const db = getDb();
    const conditions: SQL[] = [eq(storage.id, _id)];
    if (options?.trashed !== undefined) {
      conditions.push(eq(storage.trashed, options.trashed));
    }
    const [row] = await db
      .select()
      .from(storage)
      .where(and(...conditions))
      .limit(1);
    if (!row) return null;
    return rowToStorage(row);
  }

  async findByFilename(
    filename: string,
    options?: FindOptions,
  ): Promise<IStorage | null> {
    const db = getDb();
    const conditions: SQL[] = [eq(storage.filename, filename)];
    if (options?.trashed !== undefined) {
      conditions.push(eq(storage.trashed, options.trashed));
    }
    const [row] = await db
      .select()
      .from(storage)
      .where(and(...conditions))
      .limit(1);
    if (!row) return null;
    return rowToStorage(row);
  }

  async findMany(payload?: StorageQueryPayload): Promise<IStorage[]> {
    const db = getDb();
    const where = buildWhere(payload);

    let query = db.select().from(storage).$dynamic();
    if (where) query = query.where(where);
    query = query.orderBy(asc(storage.createdAt));

    if (payload?.page && payload?.perPage) {
      const offset = (payload.page - 1) * payload.perPage;
      query = query.limit(payload.perPage).offset(offset);
    }

    const rows = await query;
    return rows.map((row): IStorage => rowToStorage(row));
  }

  async update({ _id, ...payload }: StorageUpdatePayload): Promise<IStorage> {
    const db = getDb();
    const [row] = await db
      .update(storage)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(storage.id, _id))
      .returning();
    if (!row) throw new Error('Storage not found');
    return rowToStorage(row);
  }

  async delete(_id: string): Promise<IStorage | null> {
    const db = getDb();
    const [row] = await db
      .delete(storage)
      .where(eq(storage.id, _id))
      .returning();
    if (!row) return null;
    return rowToStorage(row);
  }

  async count(payload?: StorageQueryPayload): Promise<number> {
    const db = getDb();
    const where = buildWhere(payload);
    let query = db.select({ value: countFn() }).from(storage).$dynamic();
    if (where) query = query.where(where);
    const [row] = await query;
    return row?.value ?? 0;
  }
}
