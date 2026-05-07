---
id: eslint-plugin-router
title: ESLint Plugin Router
---

O TanStack Router vem com seu próprio plugin de ESLint. Este plugin é usado para aplicar boas práticas e ajudar você a evitar erros comuns.

## Instalação

O plugin é um pacote separado que você precisa instalar:

```sh
npm install -D @tanstack/eslint-plugin-router
```

ou

```sh
pnpm add -D @tanstack/eslint-plugin-router
```

ou

```sh
yarn add -D @tanstack/eslint-plugin-router
```

ou

```sh
bun add -D @tanstack/eslint-plugin-router
```

## Flat Config (`eslint.config.js`)

O lançamento do ESLint 9.0 introduziu uma nova forma de configurar o ESLint usando um formato de flat config. Este novo formato é mais flexível e permite configurar o ESLint de forma mais granular do que o formato legado `.eslintrc`. O plugin ESLint do TanStack Router suporta este novo formato e fornece uma configuração recomendada que você pode usar para habilitar todas as regras recomendadas do plugin.

### Configuração recomendada de Flat Config

Para habilitar todas as regras recomendadas do nosso plugin, adicione a seguinte configuração:

```js
// eslint.config.js
import pluginRouter from "@tanstack/eslint-plugin-router";

export default [
  ...pluginRouter.configs["flat/recommended"],
  // Any other config...
];
```

### Configuração personalizada de Flat Config

Alternativamente, você pode carregar o plugin e configurar apenas as regras que deseja usar:

```js
// eslint.config.js
import pluginRouter from "@tanstack/eslint-plugin-router";

export default [
  {
    plugins: {
      "@tanstack/router": pluginRouter,
    },
    rules: {
      "@tanstack/router/create-route-property-order": "error",
    },
  },
  // Any other config...
];
```

## Legacy Config (`.eslintrc`)

Antes do lançamento do ESLint 9.0, a forma mais comum de configurar o ESLint era usando um arquivo `.eslintrc`. O plugin ESLint do TanStack Router ainda suporta este método de configuração.

### Configuração recomendada de Legacy Config

Para habilitar todas as regras recomendadas do nosso plugin, adicione `plugin:@tanstack/eslint-plugin-router/recommended` em extends:

```json
{
  "extends": ["plugin:@tanstack/eslint-plugin-router/recommended"]
}
```

### Configuração personalizada de Legacy Config

Alternativamente, adicione `@tanstack/eslint-plugin-router` à seção de plugins e configure as regras que deseja usar:

```json
{
  "plugins": ["@tanstack/eslint-plugin-router"],
  "rules": {
    "@tanstack/router/create-route-property-order": "error"
  }
}
```

## Regras

As seguintes regras estão disponíveis no plugin ESLint do TanStack Router:

- [@tanstack/router/create-route-property-order](./create-route-property-order.md)

## Conflitos com outros plugins de ESLint

Se você tiver outros plugins de ESLint instalados, eles podem ter regras que conflitam com este plugin. Nesse caso, você precisará fazer alguns ajustes para permitir que esses plugins funcionem juntos.

### `typescript-eslint`

A regra [`@typescript-eslint/only-throw-error`](https://typescript-eslint.io/rules/only-throw-error/), habilitada por padrão nos conjuntos de regras `recommended-type-checked` e `strict-type-checked`, não permite o lançamento de valores que não são Error como exceções, o que é considerado uma boa prática.

Para garantir que ela não entre em conflito com o TanStack Router, você deve adicionar `redirect` como um objeto que pode ser lançado.

```json
{
  "rules": {
    "@typescript-eslint/only-throw-error": [
      "error",
      {
        "allow": [
          {
            "from": "package",
            "package": "@tanstack/router-core",
            "name": "Redirect"
          }
        ]
      }
    ]
  }
}
```
