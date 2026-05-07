import type { MultipartFile } from '@fastify/multipart';
import { Readable } from 'node:stream';

import type {
  StorageReadResponse,
  StorageUploadResponse,
  StorageWriteRawResponse,
} from './storage-contract.service';
import { StorageContractService } from './storage-contract.service';

type StoredFile = StorageUploadResponse & { body: Buffer };

export default class InMemoryStorageService extends StorageContractService {
  private files: Map<string, StoredFile> = new Map();
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

  async upload(
    part: MultipartFile,
    staticName?: string,
  ): Promise<StorageUploadResponse> {
    this._checkError('upload');
    const name =
      staticName ?? Math.floor(Math.random() * 100000000)?.toString();
    const originalExt = part.filename?.split('.').pop() ?? 'bin';
    const filename = `${name}.${originalExt}`;

    const result: StorageUploadResponse = {
      filename,
      mimetype: part.mimetype,
      originalName: part.filename,
      size: 0,
    };

    this.files.set(filename, { ...result, body: Buffer.alloc(0) });
    return result;
  }

  async delete(filename: string): Promise<boolean> {
    return this.files.delete(filename);
  }

  async exists(filename: string): Promise<boolean> {
    return this.files.has(filename);
  }

  async ensureBucket(): Promise<void> {
    // noop para testes
  }

  async read(filename: string): Promise<StorageReadResponse> {
    this._checkError('read');
    const stored = this.files.get(filename);
    if (!stored) {
      throw new Error(`[InMemoryStorage] File not found: ${filename}`);
    }
    return {
      stream: Readable.from(stored.body),
      size: stored.body.length,
      mimetype: stored.mimetype,
    };
  }

  async writeRaw(
    filename: string,
    body: Buffer,
    mimetype: string,
  ): Promise<StorageWriteRawResponse> {
    this._checkError('writeRaw');
    this.files.set(filename, {
      filename,
      mimetype,
      originalName: filename,
      size: body.length,
      body,
    });
    return { size: body.length };
  }

  // Test helpers
  seedFile(
    filename: string,
    body: Buffer,
    mimetype = 'application/octet-stream',
  ): void {
    this.files.set(filename, {
      filename,
      mimetype,
      originalName: filename,
      size: body.length,
      body,
    });
  }
}
