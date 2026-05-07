/* eslint-disable no-unused-vars */
import { Service } from 'fastify-decorators';

import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';

import type { UserRemoveFromTrashPayload } from './remove-from-trash.validator';

type Response = Either<HTTPException, null>;

@Service()
export default class UserRemoveFromTrashUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: UserRemoveFromTrashPayload): Promise<Response> {
    try {
      const user = await this.userRepository.findById(payload._id, {
        trashed: true,
      });

      if (!user) {
        return left(
          HTTPException.NotFound('Usuário não encontrado', 'USER_NOT_FOUND'),
        );
      }

      if (!user.trashed) {
        return left(
          HTTPException.Conflict('Usuário não está na lixeira', 'NOT_TRASHED'),
        );
      }

      await this.userRepository.update({
        _id: user._id,
        trashed: false,
        trashedAt: null,
      });

      return right(null);
    } catch (error) {
      console.error('[users > remove-from-trash][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'REMOVE_USER_FROM_TRASH_ERROR',
        ),
      );
    }
  }
}
