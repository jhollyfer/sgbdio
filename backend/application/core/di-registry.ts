import { StorageContractRepository } from '@application/repositories/storage/storage-contract.repository';
import StorageDrizzleRepository from '@application/repositories/storage/storage-drizzle.repository';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import UserDrizzleRepository from '@application/repositories/user/user-drizzle.repository';
import { ValidationTokenContractRepository } from '@application/repositories/validation-token/validation-token-contract.repository';
import ValidationTokenDrizzleRepository from '@application/repositories/validation-token/validation-token-drizzle.repository';
import { EmailContractService } from '@application/services/email/email-contract.service';
import NodemailerEmailService from '@application/services/email/nodemailer-email.service';
import BullMQEmailQueueService from '@application/services/email-queue/bullmq-email-queue.service';
import { EmailQueueContractService } from '@application/services/email-queue/email-queue-contract.service';
import BcryptPasswordService from '@application/services/password/bcrypt-password.service';
import { PasswordContractService } from '@application/services/password/password-contract.service';
import { StorageContractService } from '@application/services/storage/storage-contract.service';
import StorageService from '@application/services/storage/storage.service';
import { injectablesHolder } from 'fastify-decorators';

/**
 * Registro explícito de dependências.
 * Quando trocar de ORM, altere apenas os imports e registros aqui.
 */
export function registerDependencies(): void {
  injectablesHolder.injectService(
    StorageContractRepository,
    StorageDrizzleRepository,
  );

  injectablesHolder.injectService(
    UserContractRepository,
    UserDrizzleRepository,
  );

  injectablesHolder.injectService(
    ValidationTokenContractRepository,
    ValidationTokenDrizzleRepository,
  );

  injectablesHolder.injectService(EmailContractService, NodemailerEmailService);

  injectablesHolder.injectService(
    EmailQueueContractService,
    BullMQEmailQueueService,
  );

  injectablesHolder.injectService(StorageContractService, StorageService);

  injectablesHolder.injectService(
    PasswordContractService,
    BcryptPasswordService,
  );
}
