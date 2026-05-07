import bcrypt from 'bcryptjs';
import supertest from 'supertest';

import { Role } from '@application/core/role.core';
import { getDb } from '@config/database.config';
import { users } from '@database/schema';
import { kernel } from '@start/kernel';

export interface AuthenticatedUser {
  user: { _id: string; email: string; name: string; role: Role };
  cookies: string[];
}

export async function createAuthenticatedUser(
  overrides?: Partial<{
    email: string;
    password: string;
    name: string;
    role: Role;
  }>,
): Promise<AuthenticatedUser> {
  const password = overrides?.password ?? 'Master@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  let role: Role = Role.MASTER;
  if (overrides?.role) role = overrides.role;

  const email = overrides?.email ?? `test-${Date.now()}@example.com`;
  const name = overrides?.name ?? 'Test User';

  const db = getDb();
  const [created] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
      status: 'ACTIVE',
    })
    .returning();

  const response = await supertest(kernel.server)
    .post('/authentication/sign-in')
    .send({ email, password });

  const setCookie = response.headers['set-cookie'];
  let cookies: string[] = [];
  if (Array.isArray(setCookie)) cookies = setCookie;
  if (typeof setCookie === 'string') cookies = [setCookie];

  return {
    user: { _id: created.id, email: created.email, name: created.name, role },
    cookies,
  };
}

export async function cleanDatabase(): Promise<void> {
  const db = getDb();
  await db.delete(users);
}
