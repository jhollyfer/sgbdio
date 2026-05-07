import { Service } from 'fastify-decorators';

export const EMAIL_QUEUE_NAME = 'email';

export const EMAIL_JOB = {
  SEND: 'send',
} as const;

export type EmailJobName = (typeof EMAIL_JOB)[keyof typeof EMAIL_JOB];

export type EmailJobPayload = {
  template: string;
  data: Record<string, unknown>;
  to: string[];
  subject: string;
  from?: string;
};

@Service()
export abstract class EmailQueueContractService {
  abstract enqueue(payload: EmailJobPayload): Promise<string>;
  abstract close(): Promise<void>;
}
