---
id: installation
title: Installation
---

Você pode instalar o React Query via [NPM](https://npmjs.com/),
ou um bom e velho `<script>` via
[ESM.sh](https://esm.sh/).

### NPM

```bash
npm i @tanstack/react-query
```

ou

```bash
pnpm add @tanstack/react-query
```

ou

```bash
yarn add @tanstack/react-query
```

ou

```bash
bun add @tanstack/react-query
```

React Query é compatível com React v18+ e funciona com ReactDOM e React Native.

> Quer dar uma volta antes de baixar? Experimente os exemplos [simple](./examples/simple) ou [basic](./examples/basic)!

### CDN

Se você não está usando um bundler de módulos ou gerenciador de pacotes, você também pode usar esta biblioteca via um CDN compatível com ESM como o [ESM.sh](https://esm.sh/). Basta adicionar uma tag `<script type="module">` no final do seu arquivo HTML:

```html
<script type="module">
  import React from "https://esm.sh/react@18.2.0";
  import ReactDOM from "https://esm.sh/react-dom@18.2.0";
  import { QueryClient } from "https://esm.sh/@tanstack/react-query";
</script>
```

> Você pode encontrar instruções sobre como usar React sem JSX [aqui](https://react.dev/reference/react/createElement#creating-an-element-without-jsx).

### Requisitos

React Query é otimizado para navegadores modernos. Ele é compatível com a seguinte configuração de navegadores

```
Chrome >= 91
Firefox >= 90
Edge >= 91
Safari >= 15
iOS >= 15
Opera >= 77
```

> Dependendo do seu ambiente, você pode precisar adicionar polyfills. Se você quiser dar suporte a navegadores mais antigos, você precisa transpilar a biblioteca a partir do `node_modules` por conta própria.

### Recomendacoes

Recomendamos que você também use nosso [ESLint Plugin Query](../../eslint/eslint-plugin-query.md) para ajudar a capturar bugs e inconsistencias enquanto você programa. Voce pode instala-lo via:

```bash
npm i -D @tanstack/eslint-plugin-query
```

ou

```bash
pnpm add -D @tanstack/eslint-plugin-query
```

ou

```bash
yarn add -D @tanstack/eslint-plugin-query
```

ou

```bash
bun add -D @tanstack/eslint-plugin-query
```
