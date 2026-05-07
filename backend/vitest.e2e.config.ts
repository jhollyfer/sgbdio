import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
          dynamicImport: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
        target: 'es2024',
      },
    }),
  ],
  test: {
    pool: 'forks',
    root: './',
    maxWorkers: 1,
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.e2e.ts'],
    include: ['**/*.controller.spec.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'build/', '**/*.config.*', '**/coverage/**'],
    },
    exclude: ['node_modules/', 'build/', '**/*.config.*', '**/coverage/**'],
  },
});
