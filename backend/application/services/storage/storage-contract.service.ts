/* eslint-disable no-unused-vars */
import type { MultipartFile } from '@fastify/multipart';
import { Service } from 'fastify-decorators';
import type { Readable } from 'node:stream';

import type { IStorage, Optional } from '@application/core/entity.core';

export type StorageUploadResponse = Optional<
  IStorage,
  | '_id'
  | 'url'
  | 'createdAt'
  | 'updatedAt'
  | 'trashedAt'
  | 'trashed'
  | 'location'
>;

export type StorageReadResponse = {
  stream: Readable;
  size: number;
  mimetype: string;
};

export type StorageWriteRawResponse = {
  size: number;
};

@Service()
export abstract class StorageContractService {
  abstract upload(
    part: MultipartFile,
    staticName?: string,
  ): Promise<StorageUploadResponse>;
  abstract delete(filename: string): Promise<boolean>;
  abstract exists(filename: string): Promise<boolean>;
  abstract ensureBucket(): Promise<void>;
  abstract read(filename: string): Promise<StorageReadResponse>;
  abstract writeRaw(
    filename: string,
    body: Buffer,
    mimetype: string,
  ): Promise<StorageWriteRawResponse>;
}
