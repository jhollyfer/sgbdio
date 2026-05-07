---
id: create-route-property-order
title: Ensure correct order of inference sensitive properties for createRoute functions
---

Para as seguintes funções, a ordem das propriedades do objeto passado importa devido à inferência de tipos:

- `createRoute`
- `createFileRoute`
- `createRootRoute`
- `createRootRouteWithContext`

A ordem correta das propriedades é a seguinte:

- `params`, `validateSearch`
- `loaderDeps`, `search.middlewares`, `ssr`
- `context`
- `beforeLoad`
- `loader`
- `onEnter`, `onStay`, `onLeave`, `head`, `scripts`, `headers`, `remountDeps`

Todas as outras propriedades são insensíveis à ordem, pois não dependem de inferência de tipos.

## Detalhes da regra

Exemplos de código **incorreto** para esta regra:

```tsx
/* eslint "@tanstack/router/create-route-property-order": "warn" */
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/path')({
  loader: async ({context}) => {
    await context.queryClient.ensureQueryData(getQueryOptions(context.hello)),
  },
  beforeLoad: () => ({hello: 'world'})
})
```

Exemplos de código **correto** para esta regra:

```tsx
/* eslint "@tanstack/router/create-route-property-order": "warn" */
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/path')({
  beforeLoad: () => ({hello: 'world'}),
  loader: async ({context}) => {
    await context.queryClient.ensureQueryData(getQueryOptions(context.hello)),
  }
})
```

## Atributos

- [x] Recomendada
- [x] Corrigível automaticamente
