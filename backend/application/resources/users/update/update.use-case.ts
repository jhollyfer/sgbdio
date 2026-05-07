/* eslint-disable no-unused-vars */
import { Service } from 'fastify-decorators';

import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import {
  E_USER_STATUS,
  type IUser as Entity,
  type ValueOf,
} from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { EmailQueueContractService } from '@application/services/email-queue/email-queue-contract.service';
import { PasswordContractService } from '@application/services/password/password-contract.service';

import type { UserUpdatePayload } from './update.validator';

type Response = Either<HTTPException, Entity>;
type Payload = UserUpdatePayload;
type RecipientType = 'current' | 'old' | 'new';

const STATUS_CHANGE_LABELS: Record<ValueOf<typeof E_USER_STATUS>, string> = {
  [E_USER_STATUS.ACTIVE]: 'Conta reativada',
  [E_USER_STATUS.INACTIVE]: 'Conta desativada',
};

@Service()
export default class UserUpdateUseCase {
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

      const oldEmail = user.email;
      const oldStatus = user.status;

      const changes: string[] = [];
      if (payload.password) changes.push('Senha alterada');
      if (payload.email && payload.email !== oldEmail) {
        changes.push(`Email alterado para ${payload.email}`);
      }
      if (payload.status && payload.status !== oldStatus) {
        changes.push(STATUS_CHANGE_LABELS[payload.status]);
      }

      const updated = await this.userRepository.update({
        ...payload,
        ...(payload.password && {
          password: await this.passwordService.hash(payload.password),
        }),
      });

      if (changes.length > 0) {
        const emailChanged = Boolean(
          payload.email && payload.email !== oldEmail,
        );

        if (emailChanged) {
          await this.enqueueAccountChangedEmail(
            oldEmail,
            updated.name,
            changes,
            'old',
          );
          await this.enqueueAccountChangedEmail(
            updated.email,
            updated.name,
            changes,
            'new',
          );
        } else {
          await this.enqueueAccountChangedEmail(
            updated.email,
            updated.name,
            changes,
            'current',
          );
        }
      }

      return right(updated);
    } catch (error) {
      console.error('[users > update][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'UPDATE_USER_ERROR',
        ),
      );
    }
  }

  private async enqueueAccountChangedEmail(
    to: string,
    name: string,
    changes: string[],
    recipientType: RecipientType,
  ): Promise<void> {
    const subjects: Record<RecipientType, string> = {
      current: 'Sua conta no SGBDIO foi atualizada',
      old: 'Seu email no SGBDIO foi alterado',
      new: 'Bem-vindo ao seu novo email no SGBDIO',
    };

    await this.emailQueue.enqueue({
      template: 'user-account-changed',
      data: { name, changes, recipientType },
      to: [to],
      subject: subjects[recipientType],
    });
  }
}
