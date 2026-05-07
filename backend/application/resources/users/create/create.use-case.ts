/* eslint-disable no-unused-vars */
import { Service } from 'fastify-decorators';

import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import {
  E_USER_STATUS,
  type IUser as Entity,
} from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { EmailQueueContractService } from '@application/services/email-queue/email-queue-contract.service';
import { PasswordContractService } from '@application/services/password/password-contract.service';
import { Env } from '@start/env';

import type { UserCreatePayload } from './create.validator';

type Response = Either<HTTPException, Entity>;
type Payload = UserCreatePayload;

@Service()
export default class UserCreateUseCase {
  constructor(
    private readonly userRepository: UserContractRepository,
    private readonly passwordService: PasswordContractService,
    private readonly emailQueue: EmailQueueContractService,
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
        role: payload.role,
        password: passwordHash,
        status: E_USER_STATUS.ACTIVE,
      });

      await this.emailQueue.enqueue({
        template: 'user-created',
        data: {
          name: payload.name,
          email: payload.email,
          loginUrl: Env.APPLICATION_CLIENT_URL,
        },
        to: [payload.email],
        subject: 'Sua conta no SGBDIO foi criada',
      });

      return right(created);
    } catch (error) {
      console.error('[users > create][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'CREATE_USER_ERROR',
        ),
      );
    }
  }
}
