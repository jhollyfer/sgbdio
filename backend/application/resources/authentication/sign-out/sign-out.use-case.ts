import { Service } from 'fastify-decorators';

import { right, type Either } from '@application/core/either.core';
import HTTPException from '@application/core/exception.core';

type Response = Either<HTTPException, { message: string }>;

@Service()
export default class SignOutUseCase {
  async execute(): Promise<Response> {
    return right({ message: 'Successfully signed out' });
  }
}
