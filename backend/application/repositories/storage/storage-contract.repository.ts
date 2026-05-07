import type {
  FindOptions,
  IStorage,
  Merge,
} from '@application/core/entity.core';

export type StorageCreatePayload = Pick<
  IStorage,
  'filename' | 'mimetype' | 'originalName' | 'size'
> &
  Partial<Pick<IStorage, 'location'>>;

export type StorageUpdatePayload = Merge<
  Pick<IStorage, '_id'>,
  Partial<StorageCreatePayload>
>;

export type StorageQueryPayload = {
  page?: number;
  perPage?: number;
  search?: string;
  mimetype?: string;
};

export abstract class StorageContractRepository {
  abstract create(payload: StorageCreatePayload): Promise<IStorage>;
  abstract createMany(payload: StorageCreatePayload[]): Promise<IStorage[]>;
  abstract findById(
    _id: string,
    options?: FindOptions,
  ): Promise<IStorage | null>;
  abstract findByFilename(
    filename: string,
    options?: FindOptions,
  ): Promise<IStorage | null>;
  abstract findMany(payload?: StorageQueryPayload): Promise<IStorage[]>;
  abstract update(payload: StorageUpdatePayload): Promise<IStorage>;
  abstract delete(_id: string): Promise<IStorage | null>;
  abstract count(payload?: StorageQueryPayload): Promise<number>;
}
