import { Queue } from 'bullmq';
import { Service } from 'fastify-decorators';

import { createBullMQConnection } from '@config/redis.config';

import {
  EMAIL_JOB,
  EMAIL_QUEUE_NAME,
  EmailQueueContractService,
  type EmailJobPayload,
} from './email-queue-contract.service';

let cachedQueue: Queue | null = null;

function getQueue(): Queue {
  if (cachedQueue) return cachedQueue;
  cachedQueue = new Queue(EMAIL_QUEUE_NAME, {
    connection: createBullMQConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 },
    },
  });
  return cachedQueue;
}

@Service()
export default class BullMQEmailQueueService extends EmailQueueContractService {
  async enqueue(payload: EmailJobPayload): Promise<string> {
    const queue = getQueue();
    const jobId = `${EMAIL_JOB.SEND}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    const job = await queue.add(EMAIL_JOB.SEND, payload, { jobId });
    return job.id ?? jobId;
  }

  async close(): Promise<void> {
    if (cachedQueue) {
      await cachedQueue.close();
      cachedQueue = null;
    }
  }
}
