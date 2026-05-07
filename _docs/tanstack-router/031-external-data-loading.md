---
id: external-data-loading
title: External Data Loading
---

> [!IMPORTANT]
> Este guia é voltado para bibliotecas de gerenciamento de state externo e sua integração com o TanStack Router para busca de dados, SSR, hydration/dehydration e streaming. Se você ainda não leu o guia padrão de [Carregamento de Dados](./data-loading.md), por favor faça isso primeiro.

## **Armazenar** ou **Coordenar**?

Embora o Router seja muito capaz de armazenar e gerenciar a maioria das necessidades de dados diretamente, às vezes você pode simplesmente querer algo mais robusto!

O Router é projetado para ser um **coordenador** perfeito para bibliotecas externas de busca e cache de dados. Isso significa que você pode usar qualquer biblioteca de busca/cache de dados que quiser, e o router coordenará o carregamento dos seus dados de uma forma que se alinha com a navegação dos seus usuários e suas expectativas de frescor.

## Quais bibliotecas de busca de dados são suportadas?

Qualquer biblioteca de busca de dados que suporte promises assíncronas pode ser usada com o TanStack Router. Isso inclui:

- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [urql](https://formidable.com/open-source/urql/)
- [Relay](https://relay.dev/)
- [Apollo](https://www.apollographql.com/docs/react/)

Ou, até mesmo...

- [Zustand](https://zustand-demo.pmnd.rs/)
- [Jotai](https://jotai.org/)
- [Recoil](https://recoiljs.org/)
- [Redux](https://redux.js.org/)

Literalmente qualquer biblioteca que **pode retornar uma promise e ler/escrever dados** pode ser integrada.

## Usando Loaders para garantir que os dados sejam carregados

A forma mais fácil de integrar uma biblioteca externa de cache/dados no Router é usar `route.loader`s para garantir que os dados necessários dentro de uma route foram carregados e estão prontos para serem exibidos.

> Mas POR QUÊ? É muito importante pré-carregar seus dados críticos de rendering no loader por algumas razões:
>
> - Sem "flash de estados de loading"
> - Sem busca de dados em cascata, causada por fetching baseado em component
> - Melhor para SEO. Se seus dados estão disponíveis no momento do rendering, eles serão indexados pelos mecanismos de busca.

Aqui está uma ilustração ingênua (não faça isso) de usar a opção `loader` de uma Route para alimentar o cache com alguns dados:

```tsx
// src/routes/posts.tsx
let postsCache = [];

export const Route = createFileRoute("/posts")({
  loader: async () => {
    postsCache = await fetchPosts();
  },
  component: () => {
    return (
      <div>
        {postsCache.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    );
  },
});
```

Este exemplo é **obviamente falho**, mas ilustra o ponto de que você pode usar a opção `loader` de uma route para alimentar seu cache com dados. Vamos ver um exemplo mais realista usando TanStack Query.

- Substitua `fetchPosts` pela API de prefetching da sua biblioteca de busca de dados preferida
- Substitua `postsCache` pela API ou hook de leitura-ou-busca da sua biblioteca de busca de dados preferida

## Um exemplo mais realista usando TanStack Query

Vamos ver um exemplo mais realista usando TanStack Query.

```tsx
// src/routes/posts.tsx
const postsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: () => fetchPosts(),
});

export const Route = createFileRoute("/posts")({
  // Use the `loader` option to ensure that the data is loaded
  loader: () => queryClient.ensureQueryData(postsQueryOptions),
  component: () => {
    // Read the data from the cache and subscribe to updates
    const {
      data: { posts },
    } = useSuspenseQuery(postsQueryOptions);

    return (
      <div>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    );
  },
});
```

### Tratamento de erros com TanStack Query

Quando um erro ocorre ao usar `suspense` com `TanStack Query`, você precisa informar às queries que deseja tentar novamente ao re-renderizar. Isso pode ser feito usando a função `reset` fornecida pelo hook `useQueryErrorResetBoundary`. Você pode invocar essa função em um efeito assim que o error component é montado. Isso garantirá que a query seja resetada e tentará buscar dados novamente quando o route component for renderizado novamente. Isso também cobrirá casos onde os usuários navegam para longe da route em vez de clicar no botão `retry`.

```tsx
export const Route = createFileRoute("/")({
  loader: () => queryClient.ensureQueryData(postsQueryOptions),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    const queryErrorResetBoundary = useQueryErrorResetBoundary();

    useEffect(() => {
      // Reset the query error boundary
      queryErrorResetBoundary.reset();
    }, [queryErrorResetBoundary]);

    return (
      <div>
        {error.message}
        <button
          onClick={() => {
            // Invalidate the route to reload the loader, and reset any router error boundaries
            router.invalidate();
          }}
        >
          retry
        </button>
      </div>
    );
  },
});
```

## SSR Dehydration/Hydration

Ferramentas que são capazes podem integrar-se com as convenientes APIs de Dehydration/Hydration do TanStack Router para transportar dados desidratados entre o servidor e o cliente e reidratá-los onde necessário. Vamos ver como fazer isso tanto com dados críticos de terceiros quanto com dados adiados de terceiros.

## Dehydration/Hydration Crítica

**Para dados críticos necessários para o primeiro rendering/pintura**, o TanStack Router suporta **opções `dehydrate` e `hydrate`** ao configurar o `Router`. Esses callbacks são funções que são automaticamente chamadas no servidor e no cliente quando o router desidrata e hidrata normalmente e permitem que você aumente os dados desidratados com seus próprios dados.

A função `dehydrate` pode retornar quaisquer dados JSON serializáveis que serão mesclados e injetados no payload desidratado que é enviado ao cliente.

Por exemplo, vamos desidratar e hidratar um `QueryClient` do TanStack Query para que os dados que buscamos no servidor estejam disponíveis para hydration no cliente.

```tsx
// src/router.tsx

export function createRouter() {
  // Make sure you create your loader client or similar data
  // stores inside of your `createRouter` function. This ensures
  // that your data stores are unique to each request and
  // always present on both server and client.
  const queryClient = new QueryClient();

  return createRouter({
    routeTree,
    // Optionally provide your loaderClient to the router context for
    // convenience (you can provide anything you want to the router
    // context!)
    context: {
      queryClient,
    },
    // On the server, dehydrate the loader client so the router
    // can serialize it and send it to the client for us
    dehydrate: () => {
      return {
        queryClientState: dehydrate(queryClient),
      };
    },
    // On the client, hydrate the loader client with the data
    // we dehydrated on the server
    hydrate: (dehydrated) => {
      hydrate(queryClient, dehydrated.queryClientState);
    },
    // Optionally, we can use `Wrap` to wrap our router in the loader client provider
    Wrap: ({ children }) => {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  });
}
```
