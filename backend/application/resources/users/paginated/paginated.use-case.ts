import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import type {
  IUser as Entity,
  IMeta,
  Paginated,
} from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { Service } from 'fastify-decorators';

import type { UserPaginatedPayload } from './paginated.validator';

type Response = Either<HTTPException, Paginated<Entity>>;
type Payload = UserPaginatedPayload;

@Service()
export default class UserPaginatedUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const sort: Record<string, 'asc' | 'desc'> = {};
      if (payload['order-name']) sort.name = payload['order-name'];
      if (payload['order-email']) sort.email = payload['order-email'];
      if (payload['order-role']) sort.role = payload['order-role'];
      if (payload['order-status']) sort.status = payload['order-status'];
      if (payload['order-created-at']) {
        sort.createdAt = payload['order-created-at'];
      }

      const users = await this.userRepository.findMany({ ...payload, sort });

      const total = await this.userRepository.count(payload);

      const lastPage = Math.ceil(total / payload.perPage);

      let firstPage = 0;
      if (total > 0) firstPage = 1;

      const meta: IMeta = {
        total,
        perPage: payload.perPage,
        page: payload.page,
        lastPage,
        firstPage,
      };

      return right({
        meta,
        data: users,
      });
    } catch (error) {
      console.error('[users > paginated][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'LIST_USER_PAGINATED_ERROR',
        ),
      );
    }
  }
}
