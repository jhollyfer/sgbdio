import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { Service } from 'fastify-decorators';

import type { UserDeletePayload } from './delete.validator';

type Response = Either<HTTPException, null>;

@Service()
export default class UserDeleteUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: UserDeletePayload): Promise<Response> {
    try {
      if (payload._id === payload.actorId) {
        return left(
          HTTPException.Conflict(
            'Você não pode excluir a si mesmo',
            'CANNOT_DELETE_SELF',
          ),
        );
      }

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

      await this.userRepository.delete(user._id);

      return right(null);
    } catch (error) {
      console.error('[users > delete][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'DELETE_USER_ERROR',
        ),
      );
    }
  }
}
