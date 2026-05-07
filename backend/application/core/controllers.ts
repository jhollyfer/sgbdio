import { Env } from '@start/env';
import type { BootstrapConfig } from 'fastify-decorators';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

type Controllers = Extract<
  BootstrapConfig,
  { controllers: unknown[] }
>['controllers'];

const isDevOrTest = ['development'].includes(Env.NODE_ENV);
const controllerPattern = /^(?!.*\.spec\.).*\.controller\.(ts|js)$/;

export async function loadControllers(): Promise<Controllers> {
  const controllers: Controllers = [];
  const controllersPath = join(process.cwd(), 'application/resources');
  const files = await readdir(controllersPath, { recursive: true });

  const controllerFiles = files
    .filter((file) => controllerPattern.test(file))
    .sort((a, b) => a.localeCompare(b));

  for (const file of controllerFiles) {
    const module = await import(join(controllersPath, file));
    controllers.push(module.default);

    if (isDevOrTest) {
      console.info(`✅ Controller ${file} loaded`);
    }
  }

  if (isDevOrTest) {
    console.info(`✅ ${controllers.length} controllers loaded`);
  }

  return controllers;
}
