/**
 * BullMQ Worker para envio de email.
 *
 * Consome jobs da fila `email`. Cada job carrega { template, data, to, subject, from? }.
 * O worker renderiza o template via EmailContractService.buildTemplate e envia
 * via EmailContractService.sendEmail.
 *
 * Retry: BullMQ aplica `attempts: 3` com backoff exponencial (1s, 5s, 25s).
 * Se o resultado de sendEmail vier com `success: false`, lanca erro para forcar retry.
 */

import { EmailContractService } from '@application/services/email/email-contract.service';
import { createBullMQConnection } from '@config/redis.config';
import { Env } from '@start/env';
import { Worker, type Job } from 'bullmq';

import {
  EMAIL_JOB,
  EMAIL_QUEUE_NAME,
  type EmailJobPayload,
} from './email-queue-contract.service';

type WorkerDeps = {
  emailService: EmailContractService;
};

let cachedWorker: Worker<EmailJobPayload> | null = null;

async function processSendJob(
  job: Job<EmailJobPayload>,
  deps: WorkerDeps,
): Promise<void> {
  const { template, data, to, subject, from } = job.data;

  const body = await deps.emailService.buildTemplate({ template, data });

  const result = await deps.emailService.sendEmail({
    to,
    subject,
    body,
    from,
  });

  if (!result.success) {
    throw new Error(
      `[EmailWorker] Falha ao enviar email: ${result.message ?? 'unknown error'}`,
    );
  }
}

export function startEmailWorker(deps: WorkerDeps): Worker<EmailJobPayload> {
  if (cachedWorker) return cachedWorker;

  const worker = new Worker<EmailJobPayload>(
    EMAIL_QUEUE_NAME,
    async (job: Job<EmailJobPayload>): Promise<void> => {
      if (job.name === EMAIL_JOB.SEND) {
        await processSendJob(job, deps);
        return;
      }
      console.warn(`[EmailWorker] Job desconhecido: ${job.name}`);
    },
    {
      connection: createBullMQConnection(),
      concurrency: Env.EMAIL_WORKER_CONCURRENCY,
    },
  );

  worker.on('completed', (job: Job<EmailJobPayload>): void => {
    console.info(`[EmailWorker] Job ${job.id} processado`);
  });

  worker.on(
    'failed',
    (job: Job<EmailJobPayload> | undefined, err: Error): void => {
      console.error(
        `[EmailWorker] Job ${job?.id} falhou (tentativa ${
          job?.attemptsMade ?? '?'
        }):`,
        err.message,
      );
    },
  );

  cachedWorker = worker;
  return worker;
}

export async function stopEmailWorker(): Promise<void> {
  if (cachedWorker) {
    await cachedWorker.close();
    cachedWorker = null;
  }
}
