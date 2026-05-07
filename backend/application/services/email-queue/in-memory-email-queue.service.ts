import {
  EmailQueueContractService,
  type EmailJobPayload,
} from './email-queue-contract.service';

interface StoredJob extends EmailJobPayload {
  id: string;
  enqueuedAt: Date;
}

export default class InMemoryEmailQueueService extends EmailQueueContractService {
  private jobs: StoredJob[] = [];
  private counter = 0;
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

  async enqueue(payload: EmailJobPayload): Promise<string> {
    this._checkError('enqueue');
    this.counter += 1;
    const id = `mem-${this.counter}`;
    this.jobs.push({ ...payload, id, enqueuedAt: new Date() });
    return id;
  }

  async close(): Promise<void> {
    this.jobs = [];
  }

  getJobs(): StoredJob[] {
    return [...this.jobs];
  }

  getLastJob(): StoredJob | undefined {
    return this.jobs[this.jobs.length - 1];
  }

  clear(): void {
    this.jobs = [];
  }
}
