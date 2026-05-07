import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { Role } from '@application/core/role.core';
import { getDb } from '@config/database.config';
import { users } from '@database/schema';
import { Env } from '@start/env';

/**
 * Cria/atualiza o usuário MASTER inicial usando BOOTSTRAP_MASTER_EMAIL,
 * BOOTSTRAP_MASTER_PASSWORD e BOOTSTRAP_MASTER_NAME do .env. Idempotente:
 * roda upsert por email. No-op silencioso se as credenciais não estiverem
 * presentes.
 */
export default async function bootstrapAdminSeed(): Promise<void> {
  const email = Env.BOOTSTRAP_MASTER_EMAIL;
  const password = Env.BOOTSTRAP_MASTER_PASSWORD;

  if (!email || !password) {
    console.info(
      '[bootstrap-admin] BOOTSTRAP_MASTER_EMAIL/PASSWORD ausentes, skip',
    );
    return;
  }

  let name = 'Master';
  if (Env.BOOTSTRAP_MASTER_NAME) name = Env.BOOTSTRAP_MASTER_NAME;

  const db = getDb();
  const passwordHash = await bcrypt.hash(password, 10);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({
        name,
        password: passwordHash,
        role: Role.MASTER,
        status: 'ACTIVE',
        trashed: false,
        trashedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));
    console.info(`[bootstrap-admin] MASTER atualizado: ${email}`);
    return;
  }

  await db.insert(users).values({
    name,
    email,
    password: passwordHash,
    role: Role.MASTER,
    status: 'ACTIVE',
  });
  console.info(`[bootstrap-admin] MASTER criado: ${email}`);
}
