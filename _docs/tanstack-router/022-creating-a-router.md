---
title: Creating a Router
---

## A Classe `Router`

Quando você estiver pronto para começar a usar seu router, precisará criar uma nova instância de `Router`. A instância do router é o cérebro central do TanStack Router e é responsável por gerenciar a route tree, combinar routes e coordenar navegações e transições de route. Ela também serve como um lugar para definir configurações gerais do router.

```tsx
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  // ...
});
```

## Route Tree

Você provavelmente vai notar rapidamente que o construtor do `Router` requer uma opção `routeTree`. Esta é a route tree que o router vai usar para combinar routes e renderizar components.

Independentemente de você ter usado [file-based routing](../routing/file-based-routing.md) ou [code-based routing](../routing/code-based-routing.md), você precisará passar sua route tree para a função `createRouter`:

### Route Tree do Sistema de Arquivos

Se você usou nosso file-based routing recomendado, então é provável que seu arquivo de route tree gerado foi criado no local padrão `src/routeTree.gen.ts`. Se você usou um local customizado, então precisará importar sua route tree desse local.

```tsx
import { routeTree } from "./routeTree.gen";
```

### Route Tree Code-Based

Se você usou code-based routing, então provavelmente criou sua route tree manualmente usando o método `addChildren` da root route:

```tsx
const routeTree = rootRoute.addChildren([
  // ...
]);
```

## Type Safety do Router

> [!IMPORTANT]
> NAO PULE ESTA SECAO!

O TanStack Router fornece suporte incrível para TypeScript, mesmo para coisas que você não esperaria, como imports diretos da biblioteca! Para tornar isso possível, você deve registrar os tipos do seu router usando o recurso de [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) do TypeScript. Isso é feito estendendo a interface `Register` em `@tanstack/react-router` com uma propriedade `router` que tem o tipo da sua instância de `router`:

```tsx
declare module "@tanstack/react-router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}
```

Com seu router registrado, agora você terá type-safety em todo o seu projeto para tudo relacionado a routing.

## Route 404 Not Found

Como prometido em guias anteriores, agora vamos cobrir a opção `notFoundRoute`. Esta opção é usada para configurar uma route que será renderizada quando nenhuma outra correspondência adequada for encontrada. Isso é útil para renderizar uma página 404 ou redirecionar para uma route padrão.

Se você está usando file-based ou code-based routing, precisará adicionar a chave `notFoundComponent` ao `createRootRoute`:

```tsx
export const Route = createRootRoute({
  component: () => (
    // ...
  ),
  notFoundComponent: () => <div>404 Not Found</div>,
});
```

## Outras Opções

Existem muitas outras opções que podem ser passadas para o construtor do `Router`. Você pode encontrar uma lista completa na [Referência da API](../api/router/RouterOptionsType.md).
