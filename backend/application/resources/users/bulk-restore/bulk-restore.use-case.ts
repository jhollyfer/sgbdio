/* eslint-disable no-unused-vars */
import { Service } from 'fastify-decorators';

import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';

import type { UserBulkRestorePayload } from './bulk-restore.validator';

type Response = Either<HTTPException, { modified: number }>;

@Service()
export default class UserBulkRestoreUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: UserBulkRestorePayload): Promise<Response> {
    try {
      const modified = await this.userRepository.updateMany({
        _ids: payload.ids,
        filterTrashed: true,
        data: {
          trashed: false,
          trashedAt: null,
        },
      });

      return right({ modified });
    } catch (error) {
      console.error('[users > bulk-restore][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'BULK_RESTORE_USERS_ERROR',
        ),
      );
    }
  }
}
