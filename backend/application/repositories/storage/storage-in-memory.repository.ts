import {
  E_STORAGE_LOCATION,
  type FindOptions,
  type IStorage,
} from '@application/core/entity.core';

import type {
  StorageContractRepository,
  StorageCreatePayload,
  StorageQueryPayload,
  StorageUpdatePayload,
} from './storage-contract.repository';

export default class StorageInMemoryRepository implements StorageContractRepository {
  items: IStorage[] = [];
  private _forcedErrors = new Map<string, Error>();

  simulateError(method: string, error: Error): void {
    this._forcedErrors.set(method, error);
  }

  private _checkError(method: string): void {
    const err = this._forcedErrors.get(method);
    if (err) {
      this._forcedErrors.delete(method);
      throw err;
    }
  }

  private buildBase(payload: StorageCreatePayload): IStorage {
    let location: IStorage['location'] = E_STORAGE_LOCATION.LOCAL;
    if (payload.location) location = payload.location;
    return {
      filename: payload.filename,
      mimetype: payload.mimetype,
      originalName: payload.originalName,
      size: payload.size,
      location,
      _id: crypto.randomUUID(),
      url: `/storage/${payload.filename}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      trashedAt: null,
      trashed: false,
    };
  }

  async create(payload: StorageCreatePayload): Promise<IStorage> {
    const storage = this.buildBase(payload);
    this.items.push(storage);
    return storage;
  }

  async createMany(payload: StorageCreatePayload[]): Promise<IStorage[]> {
    const storages = payload.map((p): IStorage => this.buildBase(p));
    this.items.push(...storages);
    return storages;
  }

  async findById(_id: string, options?: FindOptions): Promise<IStorage | null> {
    this._checkError('findById');
    const item = this.items.find((i): boolean => {
      if (i._id !== _id) return false;
      if (options?.trashed !== undefined) return i.trashed === options.trashed;
      return true;
    });
    return item ?? null;
  }

  async findByFilename(
    filename: string,
    options?: FindOptions,
  ): Promise<IStorage | null> {
    const item = this.items.find((i): boolean => {
      if (i.filename !== filename) return false;
      if (options?.trashed !== undefined) return i.trashed === options.trashed;
      return true;
    });
    return item ?? null;
  }

  async findMany(payload?: StorageQueryPayload): Promise<IStorage[]> {
    let filtered = this.items;

    if (payload?.search) {
      const search = payload.search.toLowerCase();
      filtered = filtered.filter((s): boolean =>
        s.originalName.toLowerCase().includes(search),
      );
    }

    if (payload?.mimetype) {
      filtered = filtered.filter(
        (s): boolean => s.mimetype === payload.mimetype,
      );
    }

    filtered = filtered.sort((a, b): number =>
      a.originalName.localeCompare(b.originalName),
    );

    if (payload?.page && payload?.perPage) {
      const start = (payload.page - 1) * payload.perPage;
      const end = start + payload.perPage;
      filtered = filtered.slice(start, end);
    }

    return filtered;
  }

  async update({ _id, ...payload }: StorageUpdatePayload): Promise<IStorage> {
    const storage = this.items.find((s): boolean => s._id === _id);
    if (!storage) throw new Error('Storage not found');
    Object.assign(storage, payload, { updatedAt: new Date() });
    return storage;
  }

  async delete(_id: string): Promise<IStorage | null> {
    const index = this.items.findIndex((s): boolean => s._id === _id);
    if (index === -1) return null;
    const [removed] = this.items.splice(index, 1);
    return removed;
  }

  async count(payload?: StorageQueryPayload): Promise<number> {
    const filtered = await this.findMany({
      ...payload,
      page: undefined,
      perPage: undefined,
    });
    return filtered.length;
  }
}
