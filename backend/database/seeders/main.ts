import {
  connectDatabase,
  disconnectDatabase,
  runMigrations,
} from '@config/database.config';
import { glob } from 'glob';
import path from 'path';

const FILENAME_PATTERN = /^\d{4,}-[a-z0-9-]+\.seed\.(ts|js)$/;

async function discoverSeeders(): Promise<string[]> {
  const base = process.cwd().replace(/\\/g, '/');
  const [ts, js] = await Promise.all([
    glob(base + '/database/seeders/*.seed.ts'),
    glob(base + '/database/seeders/*.seed.js'),
  ]);
  return [...ts, ...js].sort((a, b): number => a.localeCompare(b));
}

function validateFilenames(paths: string[]): void {
  const invalid: string[] = [];
  for (const fullPath of paths) {
    const filename = path.basename(fullPath);
    if (!FILENAME_PATTERN.test(filename)) {
      invalid.push(filename);
    }
  }
  if (invalid.length > 0) {
    throw new Error(
      `Seeders com nome fora do padrão '<index>-<nome>.seed.(ts|js)':\n` +
        invalid.map((name): string => `  - ${name}`).join('\n'),
    );
  }
}

async function seed(): Promise<void> {
  const started = Date.now();
  await connectDatabase();
  await runMigrations();

  try {
    const seeders = await discoverSeeders();
    validateFilenames(seeders);

    console.info('🌱 Seeding...\n');

    let ok = 0;

    for (const seederPath of seeders) {
      console.info(`🌱 Seeding ${seederPath}`);
      const mod: { default: () => Promise<void> } = await import(seederPath);
      await mod.default();
      ok++;
    }

    const elapsed = Date.now() - started;
    console.info(`\n✅ ${ok}/${seeders.length} seeders in ${elapsed}ms`);
  } finally {
    await disconnectDatabase();
  }
}

seed().catch((err): void => {
  console.error(err);
  process.exit(1);
});
