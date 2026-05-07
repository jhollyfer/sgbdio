---
id: suspense
title: Suspense
---

React Query também pode ser usado com as APIs de Suspense para Data Fetching do React. Para isso, temos hooks dedicados:

- [useSuspenseQuery](../reference/useSuspenseQuery.md)
- [useSuspenseInfiniteQuery](../reference/useSuspenseInfiniteQuery.md)
- [useSuspenseQueries](../reference/useSuspenseQueries.md)
- Adicionalmente, você pode usar `useQuery().promise` e `React.use()` (Experimental)

Ao usar o modo suspense, os states de `status` e objetos `error` não são necessários e são então substituídos pelo uso do component `React.Suspense` (incluindo o uso da prop `fallback` e React error boundaries para capturar erros). Por favor, leia a seção [Resetando Error Boundaries](#resetting-error-boundaries) e veja o [Exemplo de Suspense](../examples/suspense) para mais informações sobre como configurar o modo suspense.

Se você quer que mutations propaguem erros para o error boundary mais próximo (similar a queries), você também pode definir a opção `throwOnError` como `true`.

Habilitando o modo suspense para uma query:

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";

const { data } = useSuspenseQuery({ queryKey, queryFn });
```

Isso funciona muito bem com TypeScript, porque `data` tem a garantia de estar definido (já que erros e estados de carregamento são tratados por Suspense e ErrorBoundaries).

Por outro lado, você não pode habilitar/desabilitar a Query condicionalmente. Isso geralmente não deveria ser necessário para Queries dependentes, porque com suspense, todas as suas Queries dentro de um component são buscadas em série.

`placeholderData` também não existe para esta Query. Para evitar que a UI seja substituída por um fallback durante uma atualização, envolva suas atualizações que mudam a QueryKey em [startTransition](https://react.dev/reference/react/Suspense#preventing-unwanted-fallbacks).

### Padrão do throwOnError

Nem todos os erros são lançados para o Error Boundary mais próximo por padrão - nós só lançamos erros se não houver outros dados para mostrar. Isso significa que se uma Query obteve dados no cache com sucesso alguma vez, o component vai renderizar, mesmo que os dados estejam `stale`. Assim, o padrão para `throwOnError` é:

```
throwOnError: (error, query) => typeof query.state.data === 'undefined'
```

Como você não pode alterar `throwOnError` (porque isso permitiria que `data` se tornasse potencialmente `undefined`), você precisa lançar erros manualmente se quiser que todos os erros sejam tratados por Error Boundaries:

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";

const { data, error, isFetching } = useSuspenseQuery({ queryKey, queryFn });

if (error && !isFetching) {
  throw error;
}

// continue rendering data
```

## Resetando Error Boundaries

Seja usando **suspense** ou **throwOnError** nas suas queries, você vai precisar de uma maneira de informar as queries que deseja tentar novamente ao re-renderizar após algum erro ter ocorrido.

Erros de query podem ser resetados com o component `QueryErrorResetBoundary` ou com o hook `useQueryErrorResetBoundary`.

Ao usar o component, ele vai resetar quaisquer erros de query dentro dos limites do component:

```tsx
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const App = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <Button onClick={() => resetErrorBoundary()}>Try again</Button>
          </div>
        )}
      >
        <Page />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
```

Ao usar o hook, ele vai resetar quaisquer erros de query dentro do `QueryErrorResetBoundary` mais próximo. Se nenhum boundary estiver definido, ele os resetará globalmente:

```tsx
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const App = () => {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <div>
          There was an error!
          <Button onClick={() => resetErrorBoundary()}>Try again</Button>
        </div>
      )}
    >
      <Page />
    </ErrorBoundary>
  );
};
```

## Fetch-on-render vs Render-as-you-fetch

Por padrão, React Query no modo `suspense` funciona muito bem como uma solução **Fetch-on-render** sem configuração adicional. Isso significa que quando seus components tentam montar, eles vão disparar o fetching da query e suspender, mas apenas depois que você os importou e montou. Se você quer levar isso ao próximo nível e implementar um modelo **Render-as-you-fetch**, recomendamos implementar [Prefetching](./prefetching.md) em callbacks de roteamento e/ou eventos de interação do usuário para começar a carregar queries antes de serem montadas e, com sorte, até antes de você começar a importar ou montar seus components pai.

## Suspense no Servidor com streaming

Se você está usando `NextJs`, pode usar nossa integração **experimental** para Suspense no Servidor: `@tanstack/react-query-next-experimental`. Este pacote permitirá que você busque dados no servidor (em um client component) simplesmente chamando `useSuspenseQuery` no seu component. Os resultados serão então transmitidos via streaming do servidor para o cliente conforme os SuspenseBoundaries são resolvidos.

Para conseguir isso, envolva sua aplicação no component `ReactQueryStreamedHydration`:

```tsx
// app/providers.tsx
"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as React from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers(props: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
```

Para mais informações, confira o [Exemplo de NextJs com Suspense e Streaming](../examples/nextjs-suspense-streaming) e o guia de [Rendering Avançado & Hydration](./advanced-ssr.md).

## Usando `useQuery().promise` e `React.use()` (Experimental)

> Para habilitar este recurso, você precisa definir a opção `experimental_prefetchInRender` como `true` ao criar seu `QueryClient`

**Código de exemplo:**

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
});
```

**Uso:**

```tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos, type Todo } from "./api";

function TodoList({ query }: { query: UseQueryResult<Todo[]> }) {
  const data = React.use(query.promise);

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}

export function App() {
  const query = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

  return (
    <>
      <h1>Todos</h1>
      <React.Suspense fallback={<div>Loading...</div>}>
        <TodoList query={query} />
      </React.Suspense>
    </>
  );
}
```

Para um exemplo mais completo, veja o [exemplo de suspense no GitHub](https://github.com/TanStack/query/tree/main/examples/react/suspense).

Para um exemplo de streaming com Next.js, veja o [exemplo nextjs-suspense-streaming no GitHub](https://github.com/TanStack/query/tree/main/examples/react/nextjs-suspense-streaming).
