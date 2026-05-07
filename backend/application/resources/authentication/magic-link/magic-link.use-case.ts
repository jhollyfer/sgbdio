/* eslint-disable no-unused-vars */
import { differenceInMinutes } from 'date-fns';
import { Service } from 'fastify-decorators';

import { left, right, type Either } from '@application/core/either.core';
import {
  E_TOKEN_STATUS,
  E_USER_STATUS,
  type IUser as Entity,
} from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { ValidationTokenContractRepository } from '@application/repositories/validation-token/validation-token-contract.repository';

import type { MagicLinkPayload } from './magic-link.validator';

type Response = Either<HTTPException, Entity>;
type Payload = MagicLinkPayload;

@Service()
export default class MagicLinkUseCase {
  constructor(
    private readonly userRepository: UserContractRepository,
    private readonly validationTokenRepository: ValidationTokenContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const token = await this.validationTokenRepository.findByCode(
        payload.code,
      );

      if (!token)
        return left(
          HTTPException.NotFound(
            'Token de validação não encontrado',
            'VALIDATION_TOKEN_NOT_FOUND',
          ),
        );

      if (token.status === E_TOKEN_STATUS.VALIDATED)
        return left(
          HTTPException.Conflict(
            'Token de validação já utilizado',
            'VALIDATION_TOKEN_ALREADY_USED',
          ),
        );

      if (token.status === E_TOKEN_STATUS.EXPIRED)
        return left(
          HTTPException.Gone('Código expirado', 'VALIDATION_TOKEN_EXPIRED'),
        );

      const TIME_EXPIRATION_IN_MINUTES = 10;

      const diferenceTimeInMinutes = differenceInMinutes(
        new Date(),
        token.createdAt,
      );

      if (diferenceTimeInMinutes > TIME_EXPIRATION_IN_MINUTES) {
        await this.validationTokenRepository.update({
          _id: token._id,
          status: E_TOKEN_STATUS.EXPIRED,
        });

        return left(
          HTTPException.Gone('Código expirado', 'VALIDATION_TOKEN_EXPIRED'),
        );
      }

      await this.validationTokenRepository.update({
        _id: token._id,
        status: E_TOKEN_STATUS.VALIDATED,
      });

      const user = await this.userRepository.findById(token.user?._id);

      if (!user)
        return left(
          HTTPException.NotFound('Usuário não encontrado', 'USER_NOT_FOUND'),
        );

      if (user.status === E_USER_STATUS.INACTIVE) {
        await this.userRepository.update({
          _id: user._id,
          status: E_USER_STATUS.ACTIVE,
        });
      }

      return right(user);
    } catch (error) {
      console.error('[authentication > magic-link][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'MAGIC_LINK_ERROR',
        ),
      );
    }
  }
}
