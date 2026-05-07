import {
  EmailContractService,
  type EmailOptions,
  type EmailResult,
} from './email-contract.service';

interface StoredEmail extends EmailOptions {
  sentAt: Date;
}

export default class InMemoryEmailService extends EmailContractService {
  private emails: StoredEmail[] = [];
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

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    this.emails.push({
      ...options,
      sentAt: new Date(),
    });

    return {
      success: true,
      message: 'Email stored in memory (test mode)',
    };
  }

  async buildTemplate(payload: {
    template: string;
    data: Record<string, unknown>;
  }): Promise<string> {
    return `[Template: ${payload.template}] Data: ${JSON.stringify(payload.data)}`;
  }

  getLastEmail(): StoredEmail | undefined {
    return this.emails[this.emails.length - 1];
  }

  getEmails(): StoredEmail[] {
    return [...this.emails];
  }

  clear(): void {
    this.emails = [];
  }
}
