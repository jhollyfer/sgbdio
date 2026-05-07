import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getS3Client } from '@config/storage.config';
import type { MultipartFile } from '@fastify/multipart';
import { Service } from 'fastify-decorators';
import type { Readable } from 'node:stream';

import { processFile } from './process-file';
import type {
  StorageReadResponse,
  StorageUploadResponse,
  StorageWriteRawResponse,
} from './storage-contract.service';
import { StorageContractService } from './storage-contract.service';

@Service()
export default class S3StorageService extends StorageContractService {
  private get bucket(): string {
    return process.env.STORAGE_BUCKET!;
  }

  async ensureBucket(): Promise<void> {
    const client = getS3Client();
    const endpoint = process.env.STORAGE_ENDPOINT;

    try {
      await client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      console.info(
        `[Storage S3] Bucket "${this.bucket}" existe em ${endpoint}`,
      );
    } catch {
      console.info(
        `[Storage S3] Bucket "${this.bucket}" não encontrado, criando...`,
      );
      await client.send(new CreateBucketCommand({ Bucket: this.bucket }));
      console.info(`[Storage S3] Bucket "${this.bucket}" criado com sucesso`);
    }
  }

  async upload(
    part: MultipartFile,
    staticName?: string,
  ): Promise<StorageUploadResponse> {
    await this.ensureBucket();

    const file = await processFile(part, staticName);

    console.info(
      `[Storage S3] Upload ${file.filename} (${file.mimetype}, ${file.size} bytes)`,
    );

    await getS3Client().send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: file.filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );

    return {
      filename: file.filename,
      mimetype: file.mimetype,
      originalName: file.originalName,
      size: file.size,
    };
  }

  async delete(filename: string): Promise<boolean> {
    try {
      await getS3Client().send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: filename }),
      );
      return true;
    } catch (error) {
      console.error('[Storage S3] Erro ao deletar arquivo:', error);
      return false;
    }
  }

  async exists(filename: string): Promise<boolean> {
    try {
      await getS3Client().send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: filename }),
      );
      return true;
    } catch {
      return false;
    }
  }

  async read(filename: string): Promise<StorageReadResponse> {
    const result = await getS3Client().send(
      new GetObjectCommand({ Bucket: this.bucket, Key: filename }),
    );

    if (!result.Body) {
      throw new Error(`[Storage S3] Empty body for ${filename}`);
    }

    return {
      stream: result.Body as Readable,
      size: result.ContentLength ?? 0,
      mimetype: result.ContentType ?? 'application/octet-stream',
    };
  }

  async writeRaw(
    filename: string,
    body: Buffer,
    mimetype: string,
  ): Promise<StorageWriteRawResponse> {
    await this.ensureBucket();

    await getS3Client().send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: body,
        ContentType: mimetype,
        ContentLength: body.length,
      }),
    );

    return { size: body.length };
  }
}
