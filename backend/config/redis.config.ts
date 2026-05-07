import Redis, { type RedisOptions } from 'ioredis';

import { Env } from '@start/env';

const redis = new Redis(Env.REDIS_URL);

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export function createBullMQConnection(extra: RedisOptions = {}): Redis {
  const conn = new Redis(Env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...extra,
  });
  conn.on('error', (error) => {
    console.error('Redis (BullMQ) connection error:', error);
  });
  return conn;
}

export { redis };
