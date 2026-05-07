import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'application/**/*.ts',
    'bin/**/*.ts',
    'config/**/*.ts',
    'database/**/*.ts',
    'start/**/*.ts',
  ],
  ignoreWatch: ['node_modules'],
  outDir: 'build',
  target: 'es2024',
  format: ['esm'],
});
