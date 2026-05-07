/* eslint-disable no-unused-vars */
import type {
  E_USER_STATUS,
  FindOptions,
  IUser,
  Merge,
  ValueOf,
} from '@application/core/entity.core';
import type { Role } from '@application/core/role.core';

export type UserCreatePayload = Merge<
  Pick<IUser, 'name' | 'email' | 'password' | 'role'>,
  { status?: ValueOf<typeof E_USER_STATUS> }
>;

export type UserUpdatePayload = Merge<
  Merge<Pick<IUser, '_id'>, Partial<UserCreatePayload>>,
  {
    status?: ValueOf<typeof E_USER_STATUS>;
    trashed?: boolean;
    trashedAt?: Date | null;
  }
>;

export type UserQueryPayload = {
  page?: number;
  perPage?: number;
  search?: string;
  user?: Merge<Pick<IUser, '_id'>, { role: Role }>;
  _ids?: string[];
  status?: ValueOf<typeof E_USER_STATUS>;
  role?: Role;
  trashed?: boolean;
  sort?: Record<string, 'asc' | 'desc'>;
};

export type UserUpdateManyPayload = {
  _ids: string[];
  filterTrashed?: boolean;
  data: {
    trashed?: boolean;
    trashedAt?: Date | null;
  };
};

export abstract class UserContractRepository {
  abstract create(payload: UserCreatePayload): Promise<IUser>;
  abstract findById(_id: string, options?: FindOptions): Promise<IUser | null>;
  abstract findByEmail(
    email: string,
    options?: FindOptions,
  ): Promise<IUser | null>;
  abstract findMany(payload?: UserQueryPayload): Promise<IUser[]>;
  abstract findManyTrashed(): Promise<IUser[]>;
  abstract update(payload: UserUpdatePayload): Promise<IUser>;
  abstract updateMany(payload: UserUpdateManyPayload): Promise<number>;
  abstract delete(_id: string): Promise<void>;
  abstract deleteMany(_ids: string[]): Promise<number>;
  abstract count(payload?: UserQueryPayload): Promise<number>;
}
