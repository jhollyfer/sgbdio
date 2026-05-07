---
id: selective-ssr
title: Selective Server-Side Rendering (SSR)
---

## O que e SSR Seletivo?

No TanStack Start, routes que correspondem a requisicao inicial sao renderizadas no servidor por padrao. Isso significa que `beforeLoad` e `loader` sao executados no servidor, seguidos pela renderizacao dos components da route. O HTML resultante e enviado ao cliente, que hidrata a marcacao em uma aplicacao totalmente interativa.

No entanto, existem casos em que voce pode querer desabilitar o SSR para certas routes ou todas as routes, como:

- Quando `beforeLoad` ou `loader` requer APIs exclusivas do navegador (ex.: `localStorage`).
- Quando o component da route depende de APIs exclusivas do navegador (ex.: `canvas`).

O recurso de SSR Seletivo do TanStack Start permite que voce configure:

- Quais routes devem executar `beforeLoad` ou `loader` no servidor.
- Quais components de route devem ser renderizados no servidor.

## Como isso se compara ao modo SPA?

O [modo SPA](./spa-mode) do TanStack Start desabilita completamente a execucao no servidor de `beforeLoad` e `loader`, assim como a renderizacao no servidor dos components de route. O SSR Seletivo permite que voce configure o tratamento no servidor em uma base por route, seja estaticamente ou dinamicamente.

## Configuracao

Voce pode controlar como uma route e tratada durante a requisicao inicial do servidor usando a propriedade `ssr`. Se essa propriedade nao for definida, o padrao e `true`. Voce pode alterar esse padrao usando a opcao `defaultSsr` em `createStart`:

```tsx
// src/start.ts
import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => ({
  // Disable SSR by default
  defaultSsr: false,
}));
```

### `ssr: true`

Este e o comportamento padrao, a menos que configurado de outra forma. Na requisicao inicial, ele ira:

- Executar `beforeLoad` no servidor e enviar o context resultante para o cliente.
- Executar `loader` no servidor e enviar os dados do loader para o cliente.
- Renderizar o component no servidor e enviar a marcacao HTML para o cliente.

```tsx
// src/routes/posts/$postId.tsx
export const Route = createFileRoute("/posts/$postId")({
  ssr: true,
  beforeLoad: () => {
    console.log("Executes on the server during the initial request");
    console.log("Executes on the client for subsequent navigation");
  },
  loader: () => {
    console.log("Executes on the server during the initial request");
    console.log("Executes on the client for subsequent navigation");
  },
  component: () => <div>This component is rendered on the server</div>,
});
```

### `ssr: false`

Isso desabilita no servidor:

- A execucao do `beforeLoad` e `loader` da route.
- A renderizacao do component da route.

```tsx
// src/routes/posts/$postId.tsx
export const Route = createFileRoute("/posts/$postId")({
  ssr: false,
  beforeLoad: () => {
    console.log("Executes on the client during hydration");
  },
  loader: () => {
    console.log("Executes on the client during hydration");
  },
  component: () => <div>This component is rendered on the client</div>,
});
```

### `ssr: 'data-only'`

Esta opcao hibrida ira:

- Executar `beforeLoad` no servidor e enviar o context resultante para o cliente.
- Executar `loader` no servidor e enviar os dados do loader para o cliente.
- Desabilitar a renderizacao do component da route no servidor.

```tsx
// src/routes/posts/$postId.tsx
export const Route = createFileRoute("/posts/$postId")({
  ssr: "data-only",
  beforeLoad: () => {
    console.log("Executes on the server during the initial request");
    console.log("Executes on the client for subsequent navigation");
  },
  loader: () => {
    console.log("Executes on the server during the initial request");
    console.log("Executes on the client for subsequent navigation");
  },
  component: () => <div>This component is rendered on the client</div>,
});
```

### Forma Funcional

Para mais flexibilidade, voce pode usar a forma funcional da propriedade `ssr` para decidir em tempo de execucao se deve aplicar SSR a uma route:

```tsx
// src/routes/docs/$docType/$docId.tsx
export const Route = createFileRoute("/docs/$docType/$docId")({
  validateSearch: z.object({ details: z.boolean().optional() }),
  ssr: ({ params, search }) => {
    if (params.status === "success" && params.value.docType === "sheet") {
      return false;
    }
    if (search.status === "success" && search.value.details) {
      return "data-only";
    }
  },
  beforeLoad: () => {
    console.log("Executes on the server depending on the result of ssr()");
  },
  loader: () => {
    console.log("Executes on the server depending on the result of ssr()");
  },
  component: () => <div>This component is rendered on the client</div>,
});
```

A funcao `ssr` e executada apenas no servidor durante a requisicao inicial e e removida do bundle do cliente.

`search` e `params` sao passados apos a validacao como uma discriminated union:

```tsx
params:
    | { status: 'success'; value: Expand<ResolveAllParamsFromParent<TParentRoute, TParams>> }
    | { status: 'error'; error: unknown }
search:
    | { status: 'success'; value: Expand<ResolveFullSearchSchema<TParentRoute, TSearchValidator>> }
    | { status: 'error'; error: unknown }
```

Se a validacao falhar, `status` sera `error` e `error` contera os detalhes da falha. Caso contrario, `status` sera `success` e `value` contera os dados validados.

### Heranca

Em tempo de execucao, uma route filha herda a configuracao de SSR Seletivo da sua route pai. No entanto, o valor herdado so pode ser alterado para ser mais restritivo (ou seja, de `true` para `data-only` ou `false`, e de `data-only` para `false`). Por exemplo:

```tsx
root { ssr: undefined }
  posts { ssr: false }
     $postId { ssr: true }
```

- `root` assume o padrao `ssr: true`.
- `posts` define explicitamente `ssr: false`, entao nem `beforeLoad` nem `loader` serao executados no servidor, e o component da route nao sera renderizado no servidor.
- `$postId` define `ssr: true`, mas herda `ssr: false` do seu pai. Como o valor herdado so pode ser alterado para ser mais restritivo, `ssr: true` nao tem efeito e o `ssr: false` herdado permanecera.

Outro exemplo:

```tsx
root { ssr: undefined }
  posts { ssr: 'data-only' }
     $postId { ssr: true }
       details { ssr: false }
```

- `root` assume o padrao `ssr: true`.
- `posts` define `ssr: 'data-only'`, entao `beforeLoad` e `loader` sao executados no servidor, mas o component da route nao e renderizado no servidor.
- `$postId` define `ssr: true`, mas herda `ssr: 'data-only'` do seu pai.
- `details` define `ssr: false`, entao nem `beforeLoad` nem `loader` serao executados no servidor, e o component da route nao sera renderizado no servidor. Aqui o valor herdado e alterado para ser mais restritivo e, portanto, o `ssr: false` sobrescrevera o valor herdado.

## Renderizacao de Fallback

Para a primeira route com `ssr: false` ou `ssr: 'data-only'`, o servidor renderizara o `pendingComponent` da route como fallback. Se `pendingComponent` nao estiver configurado, o `defaultPendingComponent` sera renderizado. Se nenhum dos dois estiver configurado, nenhum fallback sera renderizado.

No cliente durante a hydration, esse fallback sera exibido por pelo menos `minPendingMs` (ou `defaultPendingMinMs` se nao configurado), mesmo que a route nao tenha `beforeLoad` ou `loader` definidos.

## Como desabilitar SSR da route raiz?

Voce pode desabilitar a renderizacao no servidor do component da route raiz, porem o shell `<html>` ainda precisa ser renderizado no servidor. Esse shell e configurado via a propriedade `shellComponent` e recebe uma unica propriedade `children`. O `shellComponent` sempre passa por SSR e envolve o `component` raiz, o `errorComponent` raiz ou o component `notFound` raiz, respectivamente.

Uma configuracao minima de uma route raiz com SSR desabilitado para o component da route se parece com isso:

```tsx
import * as React from "react";

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  shellComponent: RootShell,
  component: RootComponent,
  errorComponent: () => <div>Error</div>,
  notFoundComponent: () => <div>Not found</div>,
  ssr: false, // or `defaultSsr: false` on the router
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div>
      <h1>This component will be rendered on the client</h1>
      <Outlet />
    </div>
  );
}
```
