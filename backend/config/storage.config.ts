import { S3Client } from '@aws-sdk/client-s3';
import { Env } from '@start/env';
import { join } from 'node:path';

let cachedClient: S3Client | null = null;
let cachedFingerprint = '';

export function getS3Client(): S3Client {
  const fingerprint = [
    process.env.STORAGE_ENDPOINT,
    process.env.STORAGE_ACCESS_KEY,
    process.env.STORAGE_SECRET_KEY,
    process.env.STORAGE_REGION,
  ].join('|');

  if (cachedClient && cachedFingerprint === fingerprint) {
    return cachedClient;
  }

  cachedClient = new S3Client({
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY!,
      secretAccessKey: process.env.STORAGE_SECRET_KEY!,
    },
    region: process.env.STORAGE_REGION || 'us-east-1',
    endpoint: process.env.STORAGE_ENDPOINT,
    forcePathStyle: true,
  });

  cachedFingerprint = fingerprint;

  return cachedClient;
}

export function getStorageDriver(): 'local' | 's3' {
  return (process.env.STORAGE_DRIVER as 'local' | 's3') || 'local';
}

export function getLocalStoragePath(): string {
  return join(process.cwd(), '_storage');
}

export function getStorageUrl(key: string): string {
  return Env.APPLICATION_SERVER_URL.concat('/storage/').concat(key);
}
