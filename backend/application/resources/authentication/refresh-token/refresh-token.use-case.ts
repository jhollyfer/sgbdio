/* eslint-disable no-unused-vars */
import { Service } from 'fastify-decorators';

import { left, right, type Either } from '@application/core/either.core';
import type { IUser as Entity } from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';

import type { RefreshTokenPayload } from './refresh-token.validator';

type Response = Either<HTTPException, Entity>;
type Payload = RefreshTokenPayload;

@Service()
export default class RefreshTokenUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const user = await this.userRepository.findById(payload._id);

      if (!user)
        return left(
          HTTPException.NotFound('Usuário não encontrado', 'USER_NOT_FOUND'),
        );

      return right(user);
    } catch (error) {
      console.error('[authentication > refresh-token][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'REFRESH_TOKEN_ERROR',
        ),
      );
    }
  }
}
