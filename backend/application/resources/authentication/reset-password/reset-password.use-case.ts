import { left, right, type Either } from '@application/core/either.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { EmailQueueContractService } from '@application/services/email-queue/email-queue-contract.service';
import { PasswordContractService } from '@application/services/password/password-contract.service';
import { Service } from 'fastify-decorators';

import type { ResetPasswordPayload } from './reset-password.validator';

type Response = Either<HTTPException, null>;
type Payload = ResetPasswordPayload;

@Service()
export default class UpdatePasswordRecoveryUseCase {
  constructor(
    private readonly userRepository: UserContractRepository,
    private readonly passwordService: PasswordContractService,
    private readonly emailQueue: EmailQueueContractService,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const user = await this.userRepository.findById(payload._id);

      if (!user)
        return left(
          HTTPException.NotFound('Usuário não encontrado', 'USER_NOT_FOUND'),
        );

      const hashedPassword = await this.passwordService.hash(payload.password);

      await this.userRepository.update({
        _id: user._id,
        password: hashedPassword,
      });

      await this.emailQueue.enqueue({
        template: 'reset-password-confirmation',
        data: { name: user.name },
        to: [user.email],
        subject: 'Senha redefinida com sucesso',
      });

      return right(null);
    } catch (error) {
      console.error('[authentication > reset-password][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'UPDATE_PASSWORD_ERROR',
        ),
      );
    }
  }
}
