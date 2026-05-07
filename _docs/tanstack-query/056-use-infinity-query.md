---
id: useInfiniteQuery
title: useInfiniteQuery
---

```tsx
const {
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
  promise,
  ...result
} = useInfiniteQuery({
  queryKey,
  queryFn: ({ pageParam }) => fetchPage(pageParam),
  initialPageParam: 1,
  ...options,
  getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
    lastPage.nextCursor,
  getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) =>
    firstPage.prevCursor,
});
```

**Opções**

As opções do `useInfiniteQuery` são idênticas às do [hook `useQuery`](../reference/useQuery.md) com a adição das seguintes:

- `queryFn: (context: QueryFunctionContext) => Promise<TData>`
  - **Obrigatório, mas apenas se nenhuma função de query padrão tiver sido definida** [`defaultQueryFn`](../guides/default-query-function.md)
  - A função que a query usará para requisitar dados.
  - Recebe um [QueryFunctionContext](../guides/query-functions.md#queryfunctioncontext)
  - Deve retornar uma promise que resolva dados ou lance um erro.
- `initialPageParam: TPageParam`
  - **Obrigatório**
  - O parâmetro de página padrão a ser usado ao buscar a primeira página.
- `getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => TPageParam | undefined | null`
  - **Obrigatório**
  - Quando novos dados são recebidos para esta query, esta função recebe tanto a última página da lista infinita de dados quanto o array completo de todas as páginas, assim como as informações de pageParam.
  - Ela deve retornar **uma única variável** que será passada como o último parâmetro opcional para sua função de query.
  - Retorne `undefined` ou `null` para indicar que não há próxima página disponível.
- `getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) => TPageParam | undefined | null`
  - Quando novos dados são recebidos para esta query, esta função recebe tanto a primeira página da lista infinita de dados quanto o array completo de todas as páginas, assim como as informações de pageParam.
  - Ela deve retornar **uma única variável** que será passada como o último parâmetro opcional para sua função de query.
  - Retorne `undefined` ou `null` para indicar que não há página anterior disponível.
- `maxPages: number | undefined`
  - O número máximo de páginas a serem armazenadas nos dados da query infinita.
  - Quando o número máximo de páginas é atingido, buscar uma nova página resultará na remoção da primeira ou última página do array de páginas, dependendo da direção especificada.
  - Se `undefined` ou igual a `0`, o número de páginas é ilimitado.
  - O valor padrão é `undefined`
  - `getNextPageParam` e `getPreviousPageParam` devem estar devidamente definidos se o valor de `maxPages` for maior que `0` para permitir a busca de uma página em ambas as direções quando necessário.

**Retornos**

As propriedades retornadas pelo `useInfiniteQuery` são idênticas às do [hook `useQuery`](../reference/useQuery.md), com a adição das seguintes propriedades e uma pequena diferença em `isRefetching` e `isRefetchError`:

- `data.pages: TData[]`
  - Array contendo todas as páginas.
- `data.pageParams: unknown[]`
  - Array contendo todos os parâmetros de página.
- `isFetchingNextPage: boolean`
  - Será `true` enquanto estiver buscando a próxima página com `fetchNextPage`.
- `isFetchingPreviousPage: boolean`
  - Será `true` enquanto estiver buscando a página anterior com `fetchPreviousPage`.
- `fetchNextPage: (options?: FetchNextPageOptions) => Promise<UseInfiniteQueryResult>`
  - Esta função permite que você busque a próxima "página" de resultados.
  - `options.cancelRefetch: boolean` se definido como `true`, chamar `fetchNextPage` repetidamente invocará `queryFn` toda vez, independentemente de a invocação anterior ter sido resolvida ou não. Além disso, o resultado de invocações anteriores será ignorado. Se definido como `false`, chamar `fetchNextPage` repetidamente não terá efeito até que a primeira invocação seja resolvida. O padrão é `true`.
- `fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<UseInfiniteQueryResult>`
  - Esta função permite que você busque a "página" anterior de resultados.
  - `options.cancelRefetch: boolean` mesmo comportamento do `fetchNextPage`.
- `hasNextPage: boolean`
  - Será `true` se houver uma próxima página a ser buscada (conhecido através da opção `getNextPageParam`).
- `hasPreviousPage: boolean`
  - Será `true` se houver uma página anterior a ser buscada (conhecido através da opção `getPreviousPageParam`).
- `isFetchNextPageError: boolean`
  - Será `true` se a query falhou ao buscar a próxima página.
- `isFetchPreviousPageError: boolean`
  - Será `true` se a query falhou ao buscar a página anterior.
- `isRefetching: boolean`
  - Será `true` sempre que um refetch em segundo plano estiver em andamento, o que _não_ inclui o `pending` inicial ou a busca da próxima ou página anterior.
  - É o mesmo que `isFetching && !isPending && !isFetchingNextPage && !isFetchingPreviousPage`
- `isRefetchError: boolean`
  - Será `true` se a query falhou ao fazer refetch de uma página.
- `promise: Promise<TData>`
  - Uma promise estável que resolve para o resultado da query.
  - Pode ser usado com `React.use()` para buscar dados.
  - Requer que a feature flag `experimental_prefetchInRender` esteja habilitada no `QueryClient`.

Tenha em mente que chamadas imperativas de fetch, como `fetchNextPage`, podem interferir no comportamento padrão de refetch, resultando em dados desatualizados. Certifique-se de chamar essas funções apenas em resposta a ações do usuário, ou adicione condições como `hasNextPage && !isFetching`.
