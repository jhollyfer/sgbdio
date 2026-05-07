import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'import-x': importPlugin,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowTypedFunctionExpressions: true,
        },
      ],
      'import-x/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: [['builtin', 'external'], 'internal', 'parent', 'sibling'],
          'newlines-between': 'always',
        },
      ],
      // Desabilitado porque quebra DI com fastify-decorators
      // A regra converte imports de classes para 'import type', removendo
      // a referência no runtime e quebrando o reflect-metadata
      '@typescript-eslint/consistent-type-imports': 'off',
      // Permite uso de ?. e ?? mesmo quando TypeScript acha desnecessário
      '@typescript-eslint/no-unnecessary-condition': 'off',
      // Base no-unused-vars dá falso-positivo em parâmetros de constructor
      // (private readonly). Delega para versão typescript-aware.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Project usa pattern const + type homônimos (ex.: Role) que conflita
      // com no-redeclare. TS permite porque value-space e type-space são
      // separados; a versão typescript-aware do plugin também não trata
      // como merge declaration. Desabilita ambas.
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    ignores: ['node_modules', 'build'],
  },
];
