import type { TStorageLocation } from '@application/core/entity.core';

export interface StorageMeta {
  originalName: string;
  mimetype: string;
  location: TStorageLocation;
}

interface CacheEntry {
  meta: StorageMeta | null;
  expiresAt: number;
}

const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

export function getCachedStorageMeta(
  filename: string,
): StorageMeta | null | undefined {
  const entry = cache.get(filename);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(filename);
    return undefined;
  }
  return entry.meta;
}

export function setCachedStorageMeta(
  filename: string,
  meta: StorageMeta | null,
): void {
  cache.set(filename, { meta, expiresAt: Date.now() + TTL_MS });
}

export function invalidateStorageMeta(filename: string): void {
  cache.delete(filename);
}

export function clearStorageMetaCache(): void {
  cache.clear();
}
