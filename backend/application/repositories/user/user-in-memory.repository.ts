import {
  E_USER_STATUS,
  type FindOptions,
  type IUser,
} from '@application/core/entity.core';
import { Role } from '@application/core/role.core';

import type {
  UserContractRepository,
  UserCreatePayload,
  UserQueryPayload,
  UserUpdateManyPayload,
  UserUpdatePayload,
} from './user-contract.repository';

export default class UserInMemoryRepository implements UserContractRepository {
  items: IUser[] = [];
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

  async create(payload: UserCreatePayload): Promise<IUser> {
    let status: IUser['status'] = E_USER_STATUS.ACTIVE;
    if (payload.status) status = payload.status;
    const user: IUser = {
      _id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
      trashedAt: null,
      trashed: false,
    };
    this.items.push(user);
    return user;
  }

  async findById(_id: string, options?: FindOptions): Promise<IUser | null> {
    this._checkError('findById');
    const item = this.items.find((i): boolean => {
      if (i._id !== _id) return false;
      if (options?.trashed !== undefined) return i.trashed === options.trashed;
      return true;
    });
    return item ?? null;
  }

  async findByEmail(
    email: string,
    options?: FindOptions,
  ): Promise<IUser | null> {
    this._checkError('findByEmail');
    const item = this.items.find((i): boolean => {
      if (i.email !== email) return false;
      if (options?.trashed !== undefined) return i.trashed === options.trashed;
      return true;
    });
    return item ?? null;
  }

  async findMany(payload?: UserQueryPayload): Promise<IUser[]> {
    this._checkError('findMany');
    let filtered = this.items;

    if (payload?.trashed !== undefined) {
      filtered = filtered.filter(
        (user): boolean => user.trashed === payload.trashed,
      );
    }
    if (payload?.trashed === undefined) {
      filtered = filtered.filter((user): boolean => !user.trashed);
    }

    if (payload?._ids && payload._ids.length > 0) {
      const ids = payload._ids;
      filtered = filtered.filter((user): boolean => ids.includes(user._id));
    }

    if (payload?.status) {
      filtered = filtered.filter(
        (user): boolean => user.status === payload.status,
      );
    }

    if (payload?.role) {
      filtered = filtered.filter((user): boolean => user.role === payload.role);
    }

    if (
      payload?.role === Role.ADMINISTRATOR &&
      payload?.user?.role === Role.ADMINISTRATOR
    ) {
      filtered = filtered.filter((user): boolean => user.role !== Role.MASTER);
    }

    if (payload?.search) {
      const term = payload.search.toLowerCase();
      filtered = filtered.filter(
        (user): boolean =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term),
      );
    }

    if (payload?.page && payload?.perPage) {
      const start = (payload.page - 1) * payload.perPage;
      const end = start + payload.perPage;
      filtered = filtered.slice(start, end);
    }

    return filtered;
  }

  async update({ _id, ...payload }: UserUpdatePayload): Promise<IUser> {
    this._checkError('update');
    const updated = this.items.find((user): boolean => user._id === _id);
    if (!updated) throw new Error('User not found');
    Object.assign(updated, payload, { updatedAt: new Date() });
    return updated;
  }

  async updateMany({
    _ids,
    filterTrashed,
    data,
  }: UserUpdateManyPayload): Promise<number> {
    this._checkError('updateMany');
    let filtered = this.items.filter((u): boolean => _ids.includes(u._id));

    if (filterTrashed !== undefined) {
      filtered = filtered.filter((u): boolean => u.trashed === filterTrashed);
    }

    for (const user of filtered) {
      if (data.trashed !== undefined) user.trashed = data.trashed;
      if (data.trashedAt !== undefined) user.trashedAt = data.trashedAt;
      user.updatedAt = new Date();
    }

    return filtered.length;
  }

  async findManyTrashed(): Promise<IUser[]> {
    this._checkError('findManyTrashed');
    return this.items.filter((u): boolean => u.trashed);
  }

  async delete(_id: string): Promise<void> {
    this._checkError('delete');
    const index = this.items.findIndex((u): boolean => u._id === _id);
    if (index === -1) throw new Error('User not found');
    this.items.splice(index, 1);
  }

  async deleteMany(_ids: string[]): Promise<number> {
    this._checkError('deleteMany');
    const before = this.items.length;
    this.items = this.items.filter((u): boolean => !_ids.includes(u._id));
    return before - this.items.length;
  }

  async count(payload?: UserQueryPayload): Promise<number> {
    this._checkError('count');
    const filtered = await this.findMany({
      ...payload,
      page: undefined,
      perPage: undefined,
    });

    return filtered.length;
  }
}
