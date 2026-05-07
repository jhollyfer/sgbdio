import { Service } from 'fastify-decorators';

@Service()
export abstract class PasswordContractService {
  abstract hash(password: string): Promise<string>;
  abstract compare(plain: string, hashed: string): Promise<boolean>;
}
