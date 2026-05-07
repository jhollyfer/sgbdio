import type {
  FindOptions,
  IUser,
  IValidationToken,
} from '@application/core/entity.core';
import { Role } from '@application/core/role.core';

import type {
  ValidationTokenContractRepository,
  ValidationTokenCreatePayload,
  ValidationTokenQueryPayload,
  ValidationTokenUpdatePayload,
} from './validation-token-contract.repository';

function buildUserStub(userId: string): IUser {
  return {
    _id: userId,
    name: '',
    email: '',
    password: '',
    role: Role.ADMINISTRATOR,
    status: 'ACTIVE',
    trashed: false,
    trashedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default class ValidationTokenInMemoryRepository implements ValidationTokenContractRepository {
  items: IValidationToken[] = [];
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

  async create(
    payload: ValidationTokenCreatePayload,
  ): Promise<IValidationToken> {
    const token: IValidationToken = {
      _id: crypto.randomUUID(),
      code: payload.code,
      status: payload.status,
      user: buildUserStub(payload.user),
      createdAt: new Date(),
      updatedAt: new Date(),
      trashedAt: null,
      trashed: false,
    };
    this.items.push(token);
    return token;
  }

  async findById(
    _id: string,
    options?: FindOptions,
  ): Promise<IValidationToken | null> {
    const item = this.items.find((i): boolean => {
      if (i._id !== _id) return false;
      if (options?.trashed !== undefined) return i.trashed === options.trashed;
      return true;
    });
    return item ?? null;
  }

  async findByCode(
    code: string,
    options?: FindOptions,
  ): Promise<IValidationToken | null> {
    const item = this.items.find((i): boolean => {
      if (i.code !== code) return false;
      if (options?.trashed !== undefined) return i.trashed === options.trashed;
      return true;
    });
    return item ?? null;
  }

  async findMany(
    payload?: ValidationTokenQueryPayload,
  ): Promise<IValidationToken[]> {
    let filtered = this.items;

    if (payload?.user) {
      const userId = payload.user;
      filtered = filtered.filter((t): boolean => t.user._id === userId);
    }

    if (payload?.status) {
      filtered = filtered.filter((t): boolean => t.status === payload.status);
    }

    if (payload?.page && payload?.perPage) {
      const start = (payload.page - 1) * payload.perPage;
      const end = start + payload.perPage;
      filtered = filtered.slice(start, end);
    }

    return filtered;
  }

  async update({
    _id,
    user: userId,
    ...payload
  }: ValidationTokenUpdatePayload): Promise<IValidationToken> {
    const token = this.items.find((t): boolean => t._id === _id);
    if (!token) throw new Error('ValidationToken not found');
    Object.assign(token, payload, { updatedAt: new Date() });
    if (userId !== undefined) token.user = buildUserStub(userId);
    return token;
  }

  async delete(_id: string): Promise<void> {
    const index = this.items.findIndex((t): boolean => t._id === _id);
    if (index === -1) throw new Error('ValidationToken not found');
    this.items.splice(index, 1);
  }

  async count(payload?: ValidationTokenQueryPayload): Promise<number> {
    const filtered = await this.findMany({
      ...payload,
      page: undefined,
      perPage: undefined,
    });
    return filtered.length;
  }
}
