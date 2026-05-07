/* eslint-disable no-unused-vars */
import { Service } from 'fastify-decorators';

import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import HTTPException from '@application/core/exception.core';
import { Role } from '@application/core/role.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';

import type { UserSendToTrashPayload } from './send-to-trash.validator';

type Response = Either<HTTPException, null>;

@Service()
export default class UserSendToTrashUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: UserSendToTrashPayload): Promise<Response> {
    try {
      if (payload._id === payload.actorId) {
        return left(
          HTTPException.Conflict(
            'Você não pode enviar a si mesmo para a lixeira',
            'CANNOT_TRASH_SELF',
          ),
        );
      }

      const user = await this.userRepository.findById(payload._id);

      if (!user) {
        return left(
          HTTPException.NotFound('Usuário não encontrado', 'USER_NOT_FOUND'),
        );
      }

      if (user.trashed) {
        return left(
          HTTPException.Conflict(
            'Usuário já está na lixeira',
            'ALREADY_TRASHED',
          ),
        );
      }

      if (user.role === Role.MASTER && payload.actorRole !== Role.MASTER) {
        return left(
          HTTPException.Forbidden(
            'Apenas MASTER pode enviar outro MASTER para a lixeira',
            'CANNOT_TRASH_MASTER',
          ),
        );
      }

      await this.userRepository.update({
        _id: user._id,
        trashed: true,
        trashedAt: new Date(),
      });

      return right(null);
    } catch (error) {
      console.error('[users > send-to-trash][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'SEND_USER_TO_TRASH_ERROR',
        ),
      );
    }
  }
}
