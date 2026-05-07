---
id: query
title: TanStack Query Integration
---

> [!IMPORTANT]
> Esta integração automatiza a dehydration/hydration de SSR e streaming entre o TanStack Router e o TanStack Query. Se você ainda não leu o guia padrão de [External Data Loading](../framework/react/guide/external-data-loading.md), comece por lá.

## O que você ganha

- **Dehydration/hydration automática de SSR** do seu `QueryClient`
- **Streaming de queries** que resolvem durante o render inicial no servidor para o client
- **Tratamento de redirect** para `redirect()` lançados a partir de queries/mutations
- **Wrapping de provider** opcional com `QueryClientProvider`

## Instalação

A integração com o TanStack Query é um pacote separado que você precisa instalar:

```sh
npm install @tanstack/react-router-ssr-query
# or
pnpm add @tanstack/react-router-ssr-query
# or
yarn add @tanstack/react-router-ssr-query
# or
bun add @tanstack/react-router-ssr-query
```

## Configuração

Crie seu router e conecte a integração. Certifique-se de que um novo `QueryClient` seja criado por requisição em ambientes SSR.

```tsx
// src/router.tsx
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    // optionally expose the QueryClient via router context
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    // optional:
    // handleRedirects: true,
    // wrapQueryClient: true,
  });

  return router;
}
```

Por padrão, a integração envolve seu router com um `QueryClientProvider`. Se você já fornece seu próprio provider, passe `wrapQueryClient: false` e mantenha seu wrapper customizado.

## Comportamento de SSR e streaming

- Durante o render no servidor, a integração faz a dehydration das queries iniciais e transmite via streaming quaisquer queries subsequentes que resolvam durante a renderização.
- No client, a integração faz a hydration do state inicial e então faz a hydration incremental das queries transmitidas via streaming.
- Queries de `useSuspenseQuery` ou prefetches do loader participam do SSR/streaming. `useQuery` simples não é executado no servidor.

## Uso em routes

### Usando useSuspenseQuery vs useQuery

- `useSuspenseQuery`: executa no servidor durante o SSR quando seus dados são necessários e será transmitido via streaming para o client conforme resolve.
- `useQuery`: não executa no servidor; vai fazer fetch no client após a hydration. Use isso para dados que não são necessários para o SSR.

```tsx
// Suspense: executes on server and streams
const { data } = useSuspenseQuery(postsQuery);

// Non-suspense: executes only on client
const { data, isLoading } = useQuery(postsQuery);
```

### Prefetch com um loader e leitura com um hook

Faça o prefetch de dados críticos no `loader` do route para evitar waterfalls e flashes de carregamento, e então leia-os no component. A integração garante que os dados obtidos no servidor sejam desidratados e transmitidos via streaming para o client durante o SSR.

```tsx
// src/routes/posts.tsx
import {
  queryOptions,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: () => fetch("/api/posts").then((r) => r.json()),
});

export const Route = createFileRoute("/posts")({
  // Ensure the data is in the cache before render
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: PostsPage,
});

function PostsPage() {
  // Prefer suspense for best SSR + streaming behavior
  const { data } = useSuspenseQuery(postsQuery);
  return <div>{data.map((p: any) => p.title).join(", ")}</div>;
}
```

### Prefetching e streaming

Você também pode fazer prefetch com `fetchQuery` ou `ensureQueryData` em um loader sem consumir os dados em um component. Se você retornar a promise diretamente do loader, ela será aguardada e, portanto, bloqueará a requisição SSR até que a query termine. Se você não aguardar a promise nem retorná-la, a query será iniciada no servidor e será transmitida via streaming para o client sem bloquear a requisição SSR.

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";

const userQuery = (id: string) =>
  queryOptions({
    queryKey: ["user", id],
    queryFn: () => fetch(`/api/users/${id}`).then((r) => r.json()),
  });

export const Route = createFileRoute("/user/$id")({
  loader: ({ params }) => {
    // do not await this nor return the promise, just kick off the query to stream it to the client
    context.queryClient.fetchQuery(userQuery(params.id));
  },
});
```

## Tratamento de redirect

Se uma query ou mutation lança um `redirect(...)`, a integração intercepta no client e realiza uma navegação do router.

- Habilitado por padrão
- Desabilite com `handleRedirects: false` se você precisar de tratamento customizado

## Funciona com o TanStack Start

O TanStack Start usa o TanStack Router internamente. A mesma configuração se aplica, e a integração irá transmitir via streaming os resultados das queries durante o SSR automaticamente.
