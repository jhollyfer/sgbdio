import { left, right, type Either } from '@application/core/either.core';
import { E_TOKEN_STATUS } from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { ValidationTokenContractRepository } from '@application/repositories/validation-token/validation-token-contract.repository';
import { EmailQueueContractService } from '@application/services/email-queue/email-queue-contract.service';
import { Service } from 'fastify-decorators';

import type { RequestCodePayload } from './request-code.validator';

type Response = Either<HTTPException, null>;
type Payload = RequestCodePayload;

@Service()
export default class RequestCodeUseCase {
  constructor(
    private readonly userRepository: UserContractRepository,
    private readonly validationTokenRepository: ValidationTokenContractRepository,
    private readonly emailQueue: EmailQueueContractService,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const user = await this.userRepository.findByEmail(payload.email);

      if (!user)
        return left(
          HTTPException.NotFound('E-mail não encontrado', 'EMAIL_NOT_FOUND'),
        );

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await this.validationTokenRepository.create({
        code,
        status: E_TOKEN_STATUS.REQUESTED,
        user: user._id,
      });

      await this.emailQueue.enqueue({
        template: 'recovery-code',
        data: { name: user.name, code },
        to: [user.email],
        subject: 'Recuperação de senha - Código de verificação',
      });

      return right(null);
    } catch (error) {
      console.error('[authentication > request-code][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'REQUEST_CODE_ERROR',
        ),
      );
    }
  }
}
