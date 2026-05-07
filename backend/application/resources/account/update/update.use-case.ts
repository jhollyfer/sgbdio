import type { Either } from '@application/core/either.core';
import { left, right } from '@application/core/either.core';
import type { IUser as Entity } from '@application/core/entity.core';
import HTTPException from '@application/core/exception.core';
import { UserContractRepository } from '@application/repositories/user/user-contract.repository';
import { PasswordContractService } from '@application/services/password/password-contract.service';
import { Service } from 'fastify-decorators';

import type { ProfileUpdatePayload } from './update.validator';

type Response = Either<HTTPException, Entity>;
type Payload = ProfileUpdatePayload;

@Service()
export default class ProfileUpdateUseCase {
  constructor(
    private readonly userRepository: UserContractRepository,
    private readonly passwordService: PasswordContractService,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const user = await this.userRepository.findById(payload._id);

      if (!user)
        return left(
          HTTPException.NotFound('Usuário não encontrado', 'USER_NOT_FOUND'),
        );

      if (!payload.allowPasswordChange) {
        const updated = await this.userRepository.update({
          _id: user._id,
          name: payload.name,
          email: payload.email,
        });

        return right(updated);
      }

      if (!payload.currentPassword) {
        return left(
          HTTPException.Unauthorized(
            'Senha atual incorreta',
            'INVALID_CREDENTIALS',
            { currentPassword: 'Senha atual incorreta' },
          ),
        );
      }

      if (!payload.newPassword) {
        return left(
          HTTPException.BadRequest(
            'Nova senha não informada',
            'INVALID_PAYLOAD_FORMAT',
            { newPassword: 'A nova senha é obrigatória' },
          ),
        );
      }

      const isMatch = await this.passwordService.compare(
        payload.currentPassword,
        user.password,
      );

      if (!isMatch)
        return left(
          HTTPException.Unauthorized(
            'Senha atual incorreta',
            'INVALID_CREDENTIALS',
            { currentPassword: 'Senha atual incorreta' },
          ),
        );

      const password = await this.passwordService.hash(payload.newPassword);

      const updated = await this.userRepository.update({
        _id: user._id,
        name: payload.name,
        email: payload.email,
        password,
      });

      return right(updated);
    } catch (error) {
      console.error('[profile > update][error]:', error);
      return left(
        HTTPException.InternalServerError(
          'Erro interno do servidor',
          'UPDATE_USER_PROFILE_ERROR',
        ),
      );
    }
  }
}
