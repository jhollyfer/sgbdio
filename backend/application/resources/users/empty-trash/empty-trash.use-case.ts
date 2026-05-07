import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { Service } from 'fastify-decorators';

type Response = Either<HTTPException, { deleted: number }>;

@Service()
export default class UserEmptyTrashUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(): Promise<Response> {
    try {
      const trashed = await this.userRepository.findManyTrashed();
      const eligibleIds = trashed.map((user): string => user._id);

      if (eligibleIds.length === 0) return right({ deleted: 0 });

      const deleted = await this.userRepository.deleteMany(eligibleIds);
      return right({ deleted });
    } catch (error) {
      console.error('[users > empty-trash][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'EMPTY_TRASH_USERS_ERROR',
        ),
      );
    }
  }
}
