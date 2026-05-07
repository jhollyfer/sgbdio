---
id: QueryClient
title: QueryClient
---

## `QueryClient`

O `QueryClient` pode ser usado para interagir com um cache:

```tsx
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

await queryClient.prefetchQuery({ queryKey: ["posts"], queryFn: fetchPosts });
```

Seus métodos disponíveis são:

- [`queryClient.fetchQuery`](#queryclientfetchquery)
- [`queryClient.fetchInfiniteQuery`](#queryclientfetchinfinitequery)
- [`queryClient.prefetchQuery`](#queryclientprefetchquery)
- [`queryClient.prefetchInfiniteQuery`](#queryclientprefetchinfinitequery)
- [`queryClient.getQueryData`](#queryclientgetquerydata)
- [`queryClient.ensureQueryData`](#queryclientensurequerydata)
- [`queryClient.ensureInfiniteQueryData`](#queryclientensureinfinitequerydata)
- [`queryClient.getQueriesData`](#queryclientgetqueriesdata)
- [`queryClient.setQueryData`](#queryclientsetquerydata)
- [`queryClient.getQueryState`](#queryclientgetquerystate)
- [`queryClient.setQueriesData`](#queryclientsetqueriesdata)
- [`queryClient.invalidateQueries`](#queryclientinvalidatequeries)
- [`queryClient.refetchQueries`](#queryclientrefetchqueries)
- [`queryClient.cancelQueries`](#queryclientcancelqueries)
- [`queryClient.removeQueries`](#queryclientremovequeries)
- [`queryClient.resetQueries`](#queryclientresetqueries)
- [`queryClient.isFetching`](#queryclientisfetching)
- [`queryClient.isMutating`](#queryclientismutating)
- [`queryClient.getDefaultOptions`](#queryclientgetdefaultoptions)
- [`queryClient.setDefaultOptions`](#queryclientsetdefaultoptions)
- [`queryClient.getQueryDefaults`](#queryclientgetquerydefaults)
- [`queryClient.setQueryDefaults`](#queryclientsetquerydefaults)
- [`queryClient.getMutationDefaults`](#queryclientgetmutationdefaults)
- [`queryClient.setMutationDefaults`](#queryclientsetmutationdefaults)
- [`queryClient.getQueryCache`](#queryclientgetquerycache)
- [`queryClient.getMutationCache`](#queryclientgetmutationcache)
- [`queryClient.clear`](#queryclientclear)
- [`queryClient.resumePausedMutations`](#queryclientresumepausedmutations)

**Opções**

- `queryCache?: QueryCache`
  - Opcional
  - O query cache ao qual este client está conectado.
- `mutationCache?: MutationCache`
  - Opcional
  - O mutation cache ao qual este client está conectado.
- `defaultOptions?: DefaultOptions`
  - Opcional
  - Define padrões para todas as queries e mutations usando este queryClient.
  - Você também pode definir padrões para serem usados na [hydration](../framework/react/reference/hydration.md)

## `queryClient.fetchQuery`

`fetchQuery` é um método assíncrono que pode ser usado para buscar e fazer cache de uma query. Ele vai resolver com os dados ou lançar um erro. Use o método `prefetchQuery` se você apenas quiser fazer prefetch de uma query sem precisar do resultado.

Se a query existir e os dados não estiverem invalidados ou mais antigos que o `staleTime` fornecido, então os dados do cache serão retornados. Caso contrário, ele tentará buscar os dados mais recentes.

```tsx
try {
  const data = await queryClient.fetchQuery({ queryKey, queryFn });
} catch (error) {
  console.log(error);
}
```

Especifique um `staleTime` para buscar apenas quando os dados forem mais antigos que um determinado período de tempo:

```tsx
try {
  const data = await queryClient.fetchQuery({
    queryKey,
    queryFn,
    staleTime: 10000,
  });
} catch (error) {
  console.log(error);
}
```

**Opções**

As opções para `fetchQuery` são exatamente as mesmas de [`useQuery`](../framework/react/reference/useQuery.md), exceto as seguintes: `enabled, refetchInterval, refetchIntervalInBackground, refetchOnWindowFocus, refetchOnReconnect, refetchOnMount, notifyOnChangeProps, throwOnError, select, suspense, placeholderData`; que são estritamente para useQuery e useInfiniteQuery. Você pode verificar o [código-fonte](https://github.com/TanStack/query/blob/7cd2d192e6da3df0b08e334ea1cf04cd70478827/packages/query-core/src/types.ts#L119) para mais clareza.

**Retorno**

- `Promise<TData>`

## `queryClient.fetchInfiniteQuery`

`fetchInfiniteQuery` é similar a `fetchQuery`, mas pode ser usado para buscar e fazer cache de uma query infinita.

```tsx
try {
  const data = await queryClient.fetchInfiniteQuery({ queryKey, queryFn });
  console.log(data.pages);
} catch (error) {
  console.log(error);
}
```

**Opções**

As opções para `fetchInfiniteQuery` são exatamente as mesmas de [`fetchQuery`](#queryclientfetchquery).

**Retorno**

- `Promise<InfiniteData<TData, TPageParam>>`

## `queryClient.prefetchQuery`

`prefetchQuery` é um método assíncrono que pode ser usado para fazer prefetch de uma query antes que ela seja necessária ou renderizada com `useQuery` e similares. O método funciona da mesma forma que `fetchQuery`, exceto que não vai lançar erros ou retornar dados.

```tsx
await queryClient.prefetchQuery({ queryKey, queryFn });
```

Você pode até usá-lo com uma queryFn padrão na sua configuração!

```tsx
await queryClient.prefetchQuery({ queryKey });
```

**Opções**

As opções para `prefetchQuery` são exatamente as mesmas de [`fetchQuery`](#queryclientfetchquery).

**Retorno**

- `Promise<void>`
  - Uma promise é retornada que vai resolver imediatamente se nenhum fetch for necessário ou após a query ter sido executada. Ela não retornará dados nem lançará erros.

## `queryClient.prefetchInfiniteQuery`

`prefetchInfiniteQuery` é similar a `prefetchQuery`, mas pode ser usado para fazer prefetch e cache de uma query infinita.

```tsx
await queryClient.prefetchInfiniteQuery({ queryKey, queryFn });
```

**Opções**

As opções para `prefetchInfiniteQuery` são exatamente as mesmas de [`fetchQuery`](#queryclientfetchquery).

**Retorno**

- `Promise<void>`
  - Uma promise é retornada que vai resolver imediatamente se nenhum fetch for necessário ou após a query ter sido executada. Ela não retornará dados nem lançará erros.

## `queryClient.getQueryData`

`getQueryData` é uma função síncrona que pode ser usada para obter os dados em cache de uma query existente. Se a query não existir, `undefined` será retornado.

```tsx
const data = queryClient.getQueryData(queryKey);
```

**Opções**

- `queryKey: QueryKey`: [Query Keys](../framework/react/guides/query-keys.md)

**Retorno**

- `data: TQueryFnData | undefined`
  - Os dados da query em cache, ou `undefined` se a query não existir.

## `queryClient.ensureQueryData`

`ensureQueryData` é uma função assíncrona que pode ser usada para obter os dados em cache de uma query existente. Se a query não existir, `queryClient.fetchQuery` será chamado e seus resultados retornados.

```tsx
const data = await queryClient.ensureQueryData({ queryKey, queryFn });
```

**Opções**

- as mesmas opções de [`fetchQuery`](#queryclientfetchquery)
- `revalidateIfStale: boolean`
  - Opcional
  - Padrão: `false`
  - Se definido como `true`, dados stale serão re-buscados em segundo plano, mas os dados em cache serão retornados imediatamente.

**Retorno**

- `Promise<TData>`

## `queryClient.ensureInfiniteQueryData`

`ensureInfiniteQueryData` é uma função assíncrona que pode ser usada para obter os dados em cache de uma query infinita existente. Se a query não existir, `queryClient.fetchInfiniteQuery` será chamado e seus resultados retornados.

```tsx
const data = await queryClient.ensureInfiniteQueryData({
  queryKey,
  queryFn,
  initialPageParam,
  getNextPageParam,
});
```

**Opções**

- as mesmas opções de [`fetchInfiniteQuery`](#queryclientfetchinfinitequery)
- `revalidateIfStale: boolean`
  - Opcional
  - Padrão: `false`
  - Se definido como `true`, dados stale serão re-buscados em segundo plano, mas os dados em cache serão retornados imediatamente.

**Retorno**

- `Promise<InfiniteData<TData, TPageParam>>`

## `queryClient.getQueriesData`

`getQueriesData` é uma função síncrona que pode ser usada para obter os dados em cache de múltiplas queries. Apenas queries que correspondam ao queryKey ou queryFilter passado serão retornadas. Se não houver queries correspondentes, um array vazio será retornado.

```tsx
const data = queryClient.getQueriesData(filters);
```

**Opções**

- `filters: QueryFilters`: [Query Filters](../framework/react/guides/filters.md#query-filters)
  - se um filtro for passado, os dados com queryKeys correspondentes ao filtro serão retornados

**Retorno**

- `[queryKey: QueryKey, data: TQueryFnData | undefined][]`
  - Um array de tuplas para as query keys correspondentes, ou `[]` se não houver correspondências. As tuplas contêm a query key e seus dados associados.

**Ressalvas**

Como os dados retornados em cada tupla podem ter estruturas diferentes (por exemplo, usar um filtro para retornar queries "ativas" pode retornar tipos de dados diferentes), o genérico `TData` tem `unknown` como padrão. Se você fornecer um tipo mais específico para `TData`, assume-se que você tem certeza de que os dados de cada tupla são todos do mesmo tipo.

Essa distinção é mais uma "conveniência" para desenvolvedores TypeScript que sabem qual estrutura será retornada.

## `queryClient.setQueryData`

`setQueryData` é uma função síncrona que pode ser usada para atualizar imediatamente os dados em cache de uma query. Se a query não existir, ela será criada. **Se a query não for utilizada por um hook de query no `gcTime` padrão de 5 minutos, a query será coletada pelo garbage collection**. Para atualizar múltiplas queries de uma vez e corresponder parcialmente query keys, você precisa usar [`queryClient.setQueriesData`](#queryclientsetqueriesdata) em vez disso.

> A diferença entre usar `setQueryData` e `fetchQuery` é que `setQueryData` é síncrono e assume que você já tem os dados disponíveis de forma síncrona. Se você precisar buscar os dados de forma assíncrona, é sugerido que você refaça o fetch da query key ou use `fetchQuery` para lidar com o fetch assíncrono.

```tsx
queryClient.setQueryData(queryKey, updater);
```

**Opções**

- `queryKey: QueryKey`: [Query Keys](../framework/react/guides/query-keys.md)
- `updater: TQueryFnData | undefined | ((oldData: TQueryFnData | undefined) => TQueryFnData | undefined)`
  - Se um valor que não é função for passado, os dados serão atualizados para esse valor
  - Se uma função for passada, ela receberá o valor antigo dos dados e deverá retornar um novo.

**Usando um valor de atualização**

```tsx
setQueryData(queryKey, newData);
```

Se o valor for `undefined`, os dados da query não serão atualizados.

**Usando uma função de atualização**

Por conveniência na sintaxe, você também pode passar uma função de atualização que recebe o valor atual dos dados e retorna o novo:

```tsx
setQueryData(queryKey, (oldData) => newData);
```

Se a função de atualização retornar `undefined`, os dados da query não serão atualizados. Se a função de atualização receber `undefined` como entrada, você pode retornar `undefined` para cancelar a atualização e assim _não_ criar uma nova entrada no cache.

**Imutabilidade**

Atualizações via `setQueryData` devem ser realizadas de forma _imutável_. **NÃO** tente escrever diretamente no cache mutando `oldData` ou dados que você obteve via `getQueryData` diretamente.

## `queryClient.getQueryState`

`getQueryState` é uma função síncrona que pode ser usada para obter o state de uma query existente. Se a query não existir, `undefined` será retornado.

```tsx
const state = queryClient.getQueryState(queryKey);
console.log(state.dataUpdatedAt);
```

**Opções**

- `queryKey: QueryKey`: [Query Keys](../framework/react/guides/query-keys.md)

## `queryClient.setQueriesData`

`setQueriesData` é uma função síncrona que pode ser usada para atualizar imediatamente os dados em cache de múltiplas queries usando uma função de filtro ou correspondendo parcialmente a query key. Apenas queries que correspondam ao queryKey ou queryFilter passado serão atualizadas - nenhuma nova entrada de cache será criada. Por baixo dos panos, [`setQueryData`](#queryclientsetquerydata) é chamado para cada query existente.

```tsx
queryClient.setQueriesData(filters, updater);
```

**Opções**

- `filters: QueryFilters`: [Query Filters](../framework/react/guides/filters.md#query-filters)
  - se um filtro for passado, queryKeys correspondentes ao filtro serão atualizadas
- `updater: TQueryFnData | (oldData: TQueryFnData | undefined) => TQueryFnData`
  - a função de atualização ou novos dados de [setQueryData](#queryclientsetquerydata), será chamada para cada queryKey correspondente

## `queryClient.invalidateQueries`

O método `invalidateQueries` pode ser usado para invalidar e re-buscar queries individuais ou múltiplas no cache com base em suas query keys ou qualquer outra propriedade/state funcionalmente acessível da query. Por padrão, todas as queries correspondentes são imediatamente marcadas como inválidas e queries ativas são re-buscadas em segundo plano.

- Se você **não quer que queries ativas sejam re-buscadas**, e simplesmente marcadas como inválidas, você pode usar a opção `refetchType: 'none'`.
- Se você **quer que queries inativas também sejam re-buscadas**, use a opção `refetchType: 'all'`
- Para re-buscar, [queryClient.refetchQueries](#queryclientrefetchqueries) é chamado.

```tsx
await queryClient.invalidateQueries(
  {
    queryKey: ["posts"],
    exact,
    refetchType: "active",
  },
  { throwOnError, cancelRefetch },
);
```

**Opções**

- `filters?: QueryFilters`: [Query Filters](../framework/react/guides/filters.md#query-filters)
  - `queryKey?: QueryKey`: [Query Keys](../framework/react/guides/query-keys.md)
  - `refetchType?: 'active' | 'inactive' | 'all' | 'none'`
    - Padrão: `'active'`
    - Quando definido como `active`, apenas queries que correspondam ao predicado de refetch e estejam sendo ativamente renderizadas via `useQuery` e similares serão re-buscadas em segundo plano.
    - Quando definido como `inactive`, apenas queries que correspondam ao predicado de refetch e NÃO estejam sendo ativamente renderizadas via `useQuery` e similares serão re-buscadas em segundo plano.
    - Quando definido como `all`, todas as queries que correspondam ao predicado de refetch serão re-buscadas em segundo plano.
    - Quando definido como `none`, nenhuma query será re-buscada, e aquelas que correspondam ao predicado de refetch serão apenas marcadas como inválidas.
- `options?: InvalidateOptions`:
  - `throwOnError?: boolean`
    - Quando definido como `true`, este método lançará um erro se alguma das tarefas de refetch de query falhar.
  - `cancelRefetch?: boolean`
    - Padrão: `true`
      - Por padrão, uma requisição em andamento será cancelada antes de uma nova requisição ser feita
    - Quando definido como `false`, nenhum refetch será feito se já houver uma requisição em andamento.

## `queryClient.refetchQueries`

O método `refetchQueries` pode ser usado para re-buscar queries com base em certas condições.

Exemplos:

```tsx
// refetch all queries:
await queryClient.refetchQueries();

// refetch all stale queries:
await queryClient.refetchQueries({ stale: true });

// refetch all active queries partially matching a query key:
await queryClient.refetchQueries({ queryKey: ["posts"], type: "active" });

// refetch all active queries exactly matching a query key:
await queryClient.refetchQueries({
  queryKey: ["posts", 1],
  type: "active",
  exact: true,
});
```

**Opções**

- `filters?: QueryFilters`: [Query Filters](../framework/react/guides/filters.md#query-filters)
- `options?: RefetchOptions`:
  - `throwOnError?: boolean`
    - Quando definido como `true`, este método lançará um erro se alguma das tarefas de refetch de query falhar.
  - `cancelRefetch?: boolean`
    - Padrão: `true`
      - Por padrão, uma requisição em andamento será cancelada antes de uma nova requisição ser feita
    - Quando definido como `false`, nenhum refetch será feito se já houver uma requisição em andamento.

**Retorno**

Esta função retorna uma promise que será resolvida quando todas as queries terminarem de ser re-buscadas. Por padrão, ela **não vai** lançar um erro se algum desses refetches de queries falhar, mas isso pode ser configurado definindo a opção `throwOnError` como `true`

**Notas**

- Queries que estão "desabilitadas" porque só têm Observers desabilitados nunca serão re-buscadas.
- Queries que são "estáticas" porque só têm Observers com StaleTime estático nunca serão re-buscadas.

## `queryClient.cancelQueries`

O método `cancelQueries` pode ser usado para cancelar queries em andamento com base em suas query keys ou qualquer outra propriedade/state funcionalmente acessível da query.

Isso é mais útil ao realizar atualizações otimistas, já que você provavelmente precisará cancelar quaisquer refetches de queries em andamento para que eles não sobrescrevam sua atualização otimista quando resolverem.

```tsx
await queryClient.cancelQueries(
  { queryKey: ["posts"], exact: true },
  { silent: true },
);
```

**Opções**

- `filters?: QueryFilters`: [Query Filters](../framework/react/guides/filters.md#query-filters)
- `cancelOptions?: CancelOptions`: [Cancel Options](../framework/react/guides/query-cancellation.md#cancel-options)

**Retorno**

Este método não retorna nada

## `queryClient.removeQueries`

O método `removeQueries` pode ser usado para remover queries do cache com base em suas query keys ou qualquer outra propriedade/state funcionalmente acessível da query.

```tsx
queryClient.removeQueries({ queryKey, exact: true });
```

**Opções**

- `filters?: QueryFilters`: [Query Filters](../framework/react/guides/filters.md#query-filters)

**Retorno**

Este método não retorna nada

## `queryClient.resetQueries`

O método `resetQueries` pode ser usado para resetar queries no cache para seu
state inicial com base em suas query keys ou qualquer outra propriedade/state
funcionalmente acessível da query.

Isso vai notificar os subscribers &mdash; diferente de `clear`, que remove todos
os subscribers &mdash; e resetar a query para seu state pré-carregado &mdash; diferente de
`invalidateQueries`. Se uma query tiver `initialData`, os dados da query serão
resetados para esse valor. Se uma query estiver ativa, ela será re-buscada.

```tsx
queryClient.resetQueries({ queryKey, exact: true });
```

**Opções**

- `filters?: QueryFilters`: [Query Filters](../framework/react/guides/filters.md#query-filters)
- `options?: ResetOptions`:
  - `throwOnError?: boolean`
    - Quando definido como `true`, este método lançará um erro se alguma das tarefas de refetch de query falhar.
  - `cancelRefetch?: boolean`
    - Padrão: `true`
      - Por padrão, uma requisição em andamento será cancelada antes de uma nova requisição ser feita
    - Quando definido como `false`, nenhum refetch será feito se já houver uma requisição em andamento.

**Retorno**

Este método retorna uma promise que resolve quando todas as queries ativas forem re-buscadas.

## `queryClient.isFetching`

O método `isFetching` retorna um `integer` representando quantas queries, se alguma, no cache estão atualmente em fetching (incluindo fetching em segundo plano, carregando novas páginas ou carregando mais resultados de query infinita)

```tsx
if (queryClient.isFetching()) {
  console.log("At least one query is fetching!");
}
```

O TanStack Query também exporta um hook [`useIsFetching`](../framework/react/reference/useIsFetching.md) conveniente que permite que você se inscreva nesse state nos seus components sem criar uma assinatura manual ao query cache.

**Opções**

- `filters?: QueryFilters`: [Query Filters](../framework/react/guides/filters.md#query-filters)

**Retorno**

Este método retorna o número de queries em fetching.

## `queryClient.isMutating`

O método `isMutating` retorna um `integer` representando quantas mutations, se alguma, no cache estão atualmente em fetching.

```tsx
if (queryClient.isMutating()) {
  console.log("At least one mutation is fetching!");
}
```

O TanStack Query também exporta um hook [`useIsMutating`](../framework/react/reference/useIsMutating.md) conveniente que permite que você se inscreva nesse state nos seus components sem criar uma assinatura manual ao mutation cache.

**Opções**

- `filters: MutationFilters`: [Mutation Filters](../framework/react/guides/filters.md#mutation-filters)

**Retorno**

Este método retorna o número de mutations em fetching.

## `queryClient.getDefaultOptions`

O método `getDefaultOptions` retorna as opções padrão que foram definidas ao criar o client ou com `setDefaultOptions`.

```tsx
const defaultOptions = queryClient.getDefaultOptions();
```

## `queryClient.setDefaultOptions`

O método `setDefaultOptions` pode ser usado para definir dinamicamente as opções padrão para este queryClient. Opções padrão definidas anteriormente serão sobrescritas.

```tsx
queryClient.setDefaultOptions({
  queries: {
    staleTime: Infinity,
  },
});
```

## `queryClient.getQueryDefaults`

O método `getQueryDefaults` retorna as opções padrão que foram definidas para queries específicas:

```tsx
const defaultOptions = queryClient.getQueryDefaults(["posts"]);
```

> Note que se vários padrões de query corresponderem à query key fornecida, eles serão mesclados com base na ordem de registro.
> Veja [`setQueryDefaults`](#queryclientsetquerydefaults).

## `queryClient.setQueryDefaults`

`setQueryDefaults` pode ser usado para definir opções padrão para queries específicas:

```tsx
queryClient.setQueryDefaults(["posts"], { queryFn: fetchPosts });

function Component() {
  const { data } = useQuery({ queryKey: ["posts"] });
}
```

**Opções**

- `queryKey: QueryKey`: [Query Keys](../framework/react/guides/query-keys.md)
- `options: QueryOptions`

> Como declarado em [`getQueryDefaults`](#queryclientgetquerydefaults), a ordem de registro dos padrões de query importa.
> Como os padrões correspondentes são mesclados pelo `getQueryDefaults`, o registro deve ser feito na seguinte ordem: da **chave mais genérica** para a **menos genérica**.
> Dessa forma, padrões mais específicos vão sobrescrever padrões mais genéricos.

## `queryClient.getMutationDefaults`

O método `getMutationDefaults` retorna as opções padrão que foram definidas para mutations específicas:

```tsx
const defaultOptions = queryClient.getMutationDefaults(["addPost"]);
```

## `queryClient.setMutationDefaults`

`setMutationDefaults` pode ser usado para definir opções padrão para mutations específicas:

```tsx
queryClient.setMutationDefaults(["addPost"], { mutationFn: addPost });

function Component() {
  const { data } = useMutation({ mutationKey: ["addPost"] });
}
```

**Opções**

- `mutationKey: unknown[]`
- `options: MutationOptions`

> Similar a [`setQueryDefaults`](#queryclientsetquerydefaults), a ordem de registro importa aqui também.

## `queryClient.getQueryCache`

O método `getQueryCache` retorna o query cache ao qual este client está conectado.

```tsx
const queryCache = queryClient.getQueryCache();
```

## `queryClient.getMutationCache`

O método `getMutationCache` retorna o mutation cache ao qual este client está conectado.

```tsx
const mutationCache = queryClient.getMutationCache();
```

## `queryClient.clear`

O método `clear` limpa todos os caches conectados.

```tsx
queryClient.clear();
```

## `queryClient.resumePausedMutations`

Pode ser usado para retomar mutations que foram pausadas porque não havia conexão de rede.

```tsx
queryClient.resumePausedMutations();
```
