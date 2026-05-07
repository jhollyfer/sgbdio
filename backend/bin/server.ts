import { getInstanceByToken } from 'fastify-decorators';

import { EmailContractService } from '@application/services/email/email-contract.service';
import NodemailerEmailService from '@application/services/email/nodemailer-email.service';
import { startEmailWorker } from '@application/services/email-queue/worker';
import { connectDatabase, runMigrations } from '@config/database.config';
import { Env } from '@start/env';
import { kernel } from '@start/kernel';

async function start(): Promise<void> {
  try {
    await connectDatabase();
    console.info('Database connected');

    await runMigrations();
    console.info('Database migrations applied');

    await kernel.ready();
    await kernel.listen({ port: Env.PORT, host: '0.0.0.0' });
    console.info(`HTTP Server running on http://localhost:${Env.PORT}`);

    const emailService = getInstanceByToken<EmailContractService>(
      NodemailerEmailService,
    );
    startEmailWorker({ emailService });
    console.info('Email worker started');
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();
