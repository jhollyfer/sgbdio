import { left, right, type Either } from '@application/core/either.core';
import { E_TOKEN_STATUS, type IUser } from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { ValidationTokenContractRepository } from '@application/repositories/validation-token/validation-token-contract.repository';
import { differenceInMinutes } from 'date-fns';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { ValidateCodeBodyValidator } from './validate-code.validator';

type Response = Either<HTTPException, { user: IUser }>;
type Payload = z.infer<typeof ValidateCodeBodyValidator>;

@Service()
export default class ValidateCodeUseCase {
  constructor(
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

      return right({
        user: token.user,
      });
    } catch (error) {
      console.error('[authentication > validate-code][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'VALIDATE_CODE_ERROR',
        ),
      );
    }
  }
}
