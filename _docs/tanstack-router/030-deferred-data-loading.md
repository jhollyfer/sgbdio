---
id: deferred-data-loading
title: Deferred Data Loading
---

O TanStack Router foi projetado para executar loaders em paralelo e aguardar que todos sejam resolvidos antes de renderizar a próxima route. Isso é ótimo na maioria das vezes, mas ocasionalmente você pode querer mostrar algo ao usuário mais cedo enquanto o restante dos dados carrega em segundo plano.

O deferred data loading é um padrão que permite ao router renderizar os dados/markup críticos da próxima localização enquanto dados mais lentos e não críticos da route são resolvidos em segundo plano. Esse processo funciona tanto no client quanto no servidor (via streaming) e é uma ótima maneira de melhorar a performance percebida da sua aplicação.

Se você estiver usando uma biblioteca como [TanStack Query](https://tanstack.com/query/latest) ou qualquer outra biblioteca de data fetching, o deferred data loading funciona de forma um pouco diferente. Pule para a seção [Deferred Data Loading com Bibliotecas Externas](#deferred-data-loading-with-external-libraries) para mais informações.

## Deferred Data Loading com `Await`

Para adiar dados lentos ou não críticos, retorne uma promise **não aguardada/não resolvida** em qualquer lugar na resposta do seu loader:

```tsx
// src/routes/posts.$postId.tsx
import { createFileRoute, defer } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  loader: async () => {
    // Fetch some slower data, but do not await it
    const slowDataPromise = fetchSlowData();

    // Fetch and await some data that resolves quickly
    const fastData = await fetchFastData();

    return {
      fastData,
      deferredSlowData: slowDataPromise,
    };
  },
});
```

Assim que quaisquer promises aguardadas forem resolvidas, a próxima route começará a renderizar enquanto as promises adiadas continuam sendo resolvidas.

No component, promises adiadas podem ser resolvidas e utilizadas usando o component `Await`:

```tsx
// src/routes/posts.$postId.tsx
import { createFileRoute, Await } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  // ...
  component: PostIdComponent,
});

function PostIdComponent() {
  const { deferredSlowData, fastData } = Route.useLoaderData();

  // do something with fastData

  return (
    <Await promise={deferredSlowData} fallback={<div>Loading...</div>}>
      {(data) => {
        return <div>{data}</div>;
      }}
    </Await>
  );
}
```

> [!TIP]
> Se o seu component usa code splitting, você pode usar a [função getRouteApi](./code-splitting.md#manually-accessing-route-apis-in-other-files-with-the-getrouteapi-helper) para evitar ter que importar a configuração do `Route` para acessar o hook tipado `useLoaderData()`.

O component `Await` resolve a promise acionando o suspense boundary mais próximo até que ela seja resolvida, e então renderiza os `children` do component como uma função com os dados resolvidos.

Se a promise for rejeitada, o component `Await` lançará o erro serializado, que pode ser capturado pelo error boundary mais próximo.

[//]: # "DeferredWithAwaitFinalTip"

> [!TIP]
> No React 19, você pode usar o hook `use()` em vez do `Await`

[//]: # "DeferredWithAwaitFinalTip"

## Deferred Data Loading com Bibliotecas Externas

Quando sua estratégia para buscar informações para a route depende de [External Data Loading](./external-data-loading.md) com uma biblioteca externa como [TanStack Query](https://tanstack.com/query), o deferred data loading funciona de forma um pouco diferente, pois a biblioteca lida com o data fetching e cache para você fora do TanStack Router.

Então, em vez de usar `defer` e `Await`, você vai querer usar o `loader` da Route para iniciar o data fetching e depois usar os hooks da biblioteca para acessar os dados nos seus components.

```tsx
// src/routes/posts.$postId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { slowDataOptions, fastDataOptions } from "~/api/query-options";

export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ context: { queryClient } }) => {
    // Kick off the fetching of some slower data, but do not await it
    queryClient.prefetchQuery(slowDataOptions());

    // Fetch and await some data that resolves quickly
    await queryClient.ensureQueryData(fastDataOptions());
  },
});
```

Depois, no seu component, você pode usar os hooks da biblioteca para acessar os dados:

```tsx
// src/routes/posts.$postId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { slowDataOptions, fastDataOptions } from "~/api/query-options";

export const Route = createFileRoute("/posts/$postId")({
  // ...
  component: PostIdComponent,
});

function PostIdComponent() {
  const fastData = useSuspenseQuery(fastDataOptions());

  // do something with fastData

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SlowDataComponent />
    </Suspense>
  );
}

function SlowDataComponent() {
  const data = useSuspenseQuery(slowDataOptions());

  return <div>{data}</div>;
}
```

## Cache e Invalidação

Promises transmitidas via streaming seguem o mesmo ciclo de vida dos dados do loader aos quais estão associadas. Elas podem até ser pré-carregadas!

[//]: # "SSRContent"

## SSR e Streaming de Dados Adiados

**O streaming requer um servidor que o suporte e que o TanStack Router esteja configurado para usá-lo corretamente.**

Por favor, leia o [Guia de Streaming SSR](./ssr.md#streaming-ssr) completo para instruções passo a passo sobre como configurar seu servidor para streaming.

## Ciclo de Vida do Streaming SSR

A seguir está uma visão geral de alto nível de como o streaming de dados adiados funciona com o TanStack Router:

- Servidor
  - Promises são marcadas e rastreadas conforme são retornadas dos loaders das routes
  - Todos os loaders resolvem e quaisquer promises adiadas são serializadas e incorporadas no HTML
  - A route começa a renderizar
  - Promises adiadas renderizadas com o component `<Await>` acionam suspense boundaries, permitindo que o servidor transmita o HTML até aquele ponto via streaming
- Client
  - O client recebe o HTML inicial do servidor
  - Components `<Await>` suspendem com promises placeholder enquanto aguardam seus dados serem resolvidos no servidor
- Servidor
  - Conforme as promises adiadas resolvem, seus resultados (ou erros) são serializados e transmitidos ao client via streaming através de uma tag script inline
  - Os components `<Await>` resolvidos e seus suspense boundaries são resolvidos e o HTML resultante é transmitido ao client via streaming junto com seus dados desidratados
- Client
  - As promises placeholder suspensas dentro de `<Await>` são resolvidas com as respostas de dados/erros transmitidas via streaming e renderizam o resultado ou lançam o erro para o error boundary mais próximo

[//]: # "SSRContent"
