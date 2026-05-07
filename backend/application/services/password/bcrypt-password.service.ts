import bcrypt from 'bcryptjs';
import { Service } from 'fastify-decorators';

import { PasswordContractService } from './password-contract.service';

const SALT_ROUNDS = 10;

@Service()
export default class BcryptPasswordService extends PasswordContractService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
