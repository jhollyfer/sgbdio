import { left, right, type Either } from '@application/core/either.core';
import {
  E_USER_STATUS,
  type IUser as Entity,
} from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { Role } from '@application/core/role.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { EmailQueueContractService } from '@application/services/email-queue/email-queue-contract.service';
import { PasswordContractService } from '@application/services/password/password-contract.service';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { SignUpBodyValidator } from './sign-up.validator';

type Response = Either<HTTPException, Entity>;
type Payload = z.infer<typeof SignUpBodyValidator>;

@Service()
export default class SignUpUseCase {
  constructor(
    private readonly userRepository: UserContractRepository,
    private readonly emailQueue: EmailQueueContractService,
    private readonly passwordService: PasswordContractService,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const user = await this.userRepository.findByEmail(payload.email);

      if (user)
        return left(
          HTTPException.Conflict('Usuário já existe', 'USER_ALREADY_EXISTS', {
            email: 'Usuário já existe',
          }),
        );

      const passwordHash = await this.passwordService.hash(payload.password);

      const created = await this.userRepository.create({
        name: payload.name,
        email: payload.email,
        password: passwordHash,
        role: Role.ADMINISTRATOR,
        status: E_USER_STATUS.ACTIVE,
      });

      await this.emailQueue.enqueue({
        template: 'sign-up',
        data: { name: payload.name, email: payload.email },
        to: [payload.email],
        subject: 'Bem-vindo ao SGBDIO!',
      });

      return right(created);
    } catch (error) {
      console.error('[authentication > sign-up][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'SIGN_UP_ERROR',
        ),
      );
    }
  }
}
