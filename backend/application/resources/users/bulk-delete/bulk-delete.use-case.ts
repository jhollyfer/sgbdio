/* eslint-disable no-unused-vars */
import { Service } from 'fastify-decorators';

import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';

import type { UserBulkDeletePayload } from './bulk-delete.validator';

type Response = Either<HTTPException, { deleted: number }>;

@Service()
export default class UserBulkDeleteUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: UserBulkDeletePayload): Promise<Response> {
    try {
      if (payload.ids.includes(payload.actorId)) {
        return left(
          HTTPException.Conflict(
            'Você não pode excluir a si mesmo',
            'CANNOT_DELETE_SELF',
          ),
        );
      }

      const eligibleIds: string[] = [];
      for (const id of payload.ids) {
        const user = await this.userRepository.findById(id, { trashed: true });
        if (!user) continue;
        if (!user.trashed) continue;
        eligibleIds.push(user._id);
      }

      if (eligibleIds.length === 0) return right({ deleted: 0 });

      const deleted = await this.userRepository.deleteMany(eligibleIds);
      return right({ deleted });
    } catch (error) {
      console.error('[users > bulk-delete][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'BULK_DELETE_USERS_ERROR',
        ),
      );
    }
  }
}
