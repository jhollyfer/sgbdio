---
id: useQuery
title: useQuery
---

```tsx
const {
  data,
  dataUpdatedAt,
  error,
  errorUpdatedAt,
  failureCount,
  failureReason,
  fetchStatus,
  isError,
  isFetched,
  isFetchedAfterMount,
  isFetching,
  isInitialLoading,
  isLoading,
  isLoadingError,
  isPaused,
  isPending,
  isPlaceholderData,
  isRefetchError,
  isRefetching,
  isStale,
  isSuccess,
  isEnabled,
  promise,
  refetch,
  status,
} = useQuery(
  {
    queryKey,
    queryFn,
    gcTime,
    enabled,
    networkMode,
    initialData,
    initialDataUpdatedAt,
    meta,
    notifyOnChangeProps,
    placeholderData,
    queryKeyHashFn,
    refetchInterval,
    refetchIntervalInBackground,
    refetchOnMount,
    refetchOnReconnect,
    refetchOnWindowFocus,
    retry,
    retryOnMount,
    retryDelay,
    select,
    staleTime,
    structuralSharing,
    subscribed,
    throwOnError,
  },
  queryClient,
);
```

**Parâmetro 1 (Opções)**

- `queryKey: unknown[]`
  - **Obrigatório**
  - A query key a ser usada para esta query.
  - A query key será transformada em um hash estável. Veja [Query Keys](../guides/query-keys.md) para mais informações.
  - A query será atualizada automaticamente quando essa key mudar (desde que `enabled` não esteja definido como `false`).
- `queryFn: (context: QueryFunctionContext) => Promise<TData>`
  - **Obrigatório, mas apenas se nenhuma função de query padrão tiver sido definida.** Veja [Default Query Function](../guides/default-query-function.md) para mais informações.
  - A função que a query usará para requisitar dados.
  - Recebe um [QueryFunctionContext](../guides/query-functions.md#queryfunctioncontext)
  - Deve retornar uma promise que resolva dados ou lance um erro. Os dados não podem ser `undefined`.
- `enabled: boolean | (query: Query) => boolean`
  - Defina como `false` para desabilitar a execução automática desta query.
  - Pode ser usado para [Dependent Queries](../guides/dependent-queries.md).
- `networkMode: 'online' | 'always' | 'offlineFirst'`
  - opcional
  - o padrão é `'online'`
  - veja [Network Mode](../guides/network-mode.md) para mais informações.
- `retry: boolean | number | (failureCount: number, error: TError) => boolean`
  - Se `false`, queries com falha não serão reexecutadas por padrão.
  - Se `true`, queries com falha serão reexecutadas infinitamente.
  - Se definido como um `number`, ex: `3`, queries com falha serão reexecutadas até que a contagem de falhas atinja esse número.
  - Se definido como uma função, ela será chamada com `failureCount` (começando em `0` para a primeira tentativa) e `error` para determinar se uma nova tentativa deve ser feita.
  - o padrão é `3` no cliente e `0` no servidor
- `retryOnMount: boolean`
  - Se definido como `false`, a query não será reexecutada na montagem se contiver um erro. O padrão é `true`.
- `retryDelay: number | (retryAttempt: number, error: TError) => number`
  - Esta função recebe um inteiro `retryAttempt` e o Error real e retorna o atraso a ser aplicado antes da próxima tentativa em milissegundos.
  - Uma função como `attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)` aplica backoff exponencial.
  - Uma função como `attempt => attempt * 1000` aplica backoff linear.
- `staleTime: number | 'static' | ((query: Query) => number | 'static')`
  - Opcional
  - O padrão é `0`
  - O tempo em milissegundos após o qual os dados são considerados stale. Este valor se aplica apenas ao hook em que é definido.
  - Se definido como `Infinity`, os dados não serão considerados stale a menos que sejam invalidados manualmente.
  - Se definido como uma função, a função será executada com a query para calcular o `staleTime`.
  - Se definido como `'static'`, os dados nunca serão considerados stale.
- `gcTime: number | Infinity`
  - O padrão é `5 * 60 * 1000` (5 minutos) ou `Infinity` durante SSR
  - O tempo em milissegundos que dados de cache não utilizados/inativos permanecem na memória. Quando o cache de uma query se torna não utilizado ou inativo, esses dados serão removidos por garbage collection após essa duração. Quando tempos de garbage collection diferentes são especificados, o mais longo será usado.
  - Nota: o tempo máximo permitido é de aproximadamente [24 dias](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value), embora seja possível contornar esse limite usando [timeoutManager.setTimeoutProvider](../../../reference/timeoutManager.md#timeoutmanagersettimeoutprovider).
  - Se definido como `Infinity`, desabilitará a garbage collection.
- `queryKeyHashFn: (queryKey: QueryKey) => string`
  - Opcional
  - Se especificada, esta função é usada para gerar o hash da `queryKey` em uma string.
- `refetchInterval: number | false | ((query: Query) => number | false | undefined)`
  - Opcional
  - Se definido como um número, todas as queries farão refetch continuamente nessa frequência em milissegundos.
  - Se definido como uma função, a função será executada com a query para calcular a frequência.
- `refetchIntervalInBackground: boolean`
  - Opcional
  - Se definido como `true`, queries configuradas para refetch contínuo com `refetchInterval` continuarão fazendo refetch enquanto sua aba/janela estiver em segundo plano.
- `refetchOnMount: boolean | "always" | ((query: Query) => boolean | "always")`
  - Opcional
  - O padrão é `true`
  - Se definido como `true`, a query fará refetch na montagem se os dados estiverem stale.
  - Se definido como `false`, a query não fará refetch na montagem.
  - Se definido como `"always"`, a query sempre fará refetch na montagem (exceto quando `staleTime: 'static'` é usado).
  - Se definido como uma função, a função será executada com a query para calcular o valor.
- `refetchOnWindowFocus: boolean | "always" | ((query: Query) => boolean | "always")`
  - Opcional
  - O padrão é `true`
  - Se definido como `true`, a query fará refetch no foco da janela se os dados estiverem stale.
  - Se definido como `false`, a query não fará refetch no foco da janela.
  - Se definido como `"always"`, a query sempre fará refetch no foco da janela (exceto quando `staleTime: 'static'` é usado).
  - Se definido como uma função, a função será executada com a query para calcular o valor.
- `refetchOnReconnect: boolean | "always" | ((query: Query) => boolean | "always")`
  - Opcional
  - O padrão é `true`
  - Se definido como `true`, a query fará refetch na reconexão se os dados estiverem stale.
  - Se definido como `false`, a query não fará refetch na reconexão.
  - Se definido como `"always"`, a query sempre fará refetch na reconexão (exceto quando `staleTime: 'static'` é usado).
  - Se definido como uma função, a função será executada com a query para calcular o valor.
- `notifyOnChangeProps: string[] | "all" | (() => string[] | "all" | undefined)`
  - Opcional
  - Se definido, o component só será re-renderizado se alguma das propriedades listadas mudar.
  - Se definido como `['data', 'error']`, por exemplo, o component só será re-renderizado quando as propriedades `data` ou `error` mudarem.
  - Se definido como `"all"`, o component não usará rastreamento inteligente e será re-renderizado sempre que uma query for atualizada.
  - Se definido como uma função, a função será executada para calcular a lista de propriedades.
  - Por padrão, o acesso às propriedades será rastreado, e o component só será re-renderizado quando uma das propriedades rastreadas mudar.
- `select: (data: TData) => unknown`
  - Opcional
  - Esta opção pode ser usada para transformar ou selecionar uma parte dos dados retornados pela função de query. Ela afeta o valor `data` retornado, mas não afeta o que é armazenado no query cache.
  - A função `select` só será executada se `data` mudar, ou se a referência da própria função `select` mudar. Para otimizar, envolva a função em `useCallback`.
- `initialData: TData | () => TData`
  - Opcional
  - Se definido, este valor será usado como os dados iniciais para o query cache (desde que a query ainda não tenha sido criada ou armazenada em cache).
  - Se definido como uma função, a função será chamada **uma vez** durante a inicialização compartilhada/raiz da query, e espera-se que retorne os initialData de forma síncrona.
  - Dados iniciais são considerados stale por padrão, a menos que um `staleTime` tenha sido definido.
  - `initialData` **é persistido** no cache.
- `initialDataUpdatedAt: number | (() => number | undefined)`
  - Opcional
  - Se definido, este valor será usado como o momento (em milissegundos) em que o próprio `initialData` foi atualizado pela última vez.
- `placeholderData: TData | (previousValue: TData | undefined, previousQuery: Query | undefined) => TData`
  - Opcional
  - Se definido, este valor será usado como os dados de placeholder para este observer de query específico enquanto a query ainda estiver no state `pending`.
  - `placeholderData` **não é persistido** no cache.
  - Se você fornecer uma função para `placeholderData`, como primeiro argumento você receberá os dados da query observada anteriormente, se disponíveis, e o segundo argumento será a instância completa da previousQuery.
- `structuralSharing: boolean | (oldData: unknown | undefined, newData: unknown) => unknown`
  - Opcional
  - O padrão é `true`
  - Se definido como `false`, o compartilhamento estrutural entre resultados de query será desabilitado.
  - Se definido como uma função, os valores de dados antigos e novos serão passados por esta função, que deve combiná-los em dados resolvidos para a query. Dessa forma, você pode manter referências dos dados antigos para melhorar a performance mesmo quando esses dados contêm valores não serializáveis.
- `subscribed: boolean`
  - Opcional
  - O padrão é `true`
  - Se definido como `false`, esta instância de `useQuery` não estará inscrita no cache. Isso significa que ela não acionará a `queryFn` por conta própria, e não receberá atualizações se dados entrarem no cache por outros meios.
- `throwOnError: undefined | boolean | (error: TError, query: Query) => boolean`
  - Defina como `true` se você quiser que erros sejam lançados na fase de render e propagados para o error boundary mais próximo.
  - Defina como `false` para desabilitar o comportamento padrão do `suspense` de lançar erros para o error boundary.
  - Se definido como uma função, ela receberá o erro e a query, e deve retornar um booleano indicando se o erro deve ser mostrado em um error boundary (`true`) ou retornado como state (`false`).
- `meta: Record<string, unknown>`
  - Opcional
  - Se definido, armazena informações adicionais na entrada do query cache que podem ser usadas conforme necessário. Estará acessível onde quer que a `query` esteja disponível, e também faz parte do `QueryFunctionContext` fornecido à `queryFn`.

**Parâmetro 2 (QueryClient)**

- `queryClient?: QueryClient`
  - Use isto para usar um QueryClient personalizado. Caso contrário, o mais próximo do context será usado.

**Retornos**

- `status: QueryStatus`
  - Será:
    - `pending` se não houver dados em cache e nenhuma tentativa de query tiver sido concluída ainda.
    - `error` se a tentativa de query resultou em um erro. A propriedade `error` correspondente contém o erro recebido da tentativa de fetch.
    - `success` se a query recebeu uma resposta sem erros e está pronta para exibir seus dados. A propriedade `data` correspondente na query contém os dados recebidos do fetch bem-sucedido, ou se a propriedade `enabled` da query estiver definida como `false` e ainda não tiver sido buscada, `data` será o primeiro `initialData` fornecido à query na inicialização.
- `isPending: boolean`
  - Um booleano derivado da variável `status` acima, fornecido por conveniência.
- `isSuccess: boolean`
  - Um booleano derivado da variável `status` acima, fornecido por conveniência.
- `isError: boolean`
  - Um booleano derivado da variável `status` acima, fornecido por conveniência.
- `isLoadingError: boolean`
  - Será `true` se a query falhou durante o fetch pela primeira vez.
- `isRefetchError: boolean`
  - Será `true` se a query falhou durante o refetch.
- `data: TData`
  - O padrão é `undefined`.
  - Os últimos dados resolvidos com sucesso para a query.
- `dataUpdatedAt: number`
  - O timestamp de quando a query retornou o `status` como `"success"` mais recentemente.
- `error: null | TError`
  - O padrão é `null`
  - O objeto de erro para a query, se um erro foi lançado.
- `errorUpdatedAt: number`
  - O timestamp de quando a query retornou o `status` como `"error"` mais recentemente.
- `isStale: boolean`
  - Será `true` se os dados no cache estiverem invalidados ou se os dados forem mais antigos que o `staleTime` definido.
- `isPlaceholderData: boolean`
  - Será `true` se os dados exibidos forem os dados de placeholder.
- `isFetched: boolean`
  - Será `true` se a query já foi buscada.
- `isFetchedAfterMount: boolean`
  - Será `true` se a query foi buscada após a montagem do component.
  - Esta propriedade pode ser usada para não exibir dados previamente armazenados em cache.
- `fetchStatus: FetchStatus`
  - `fetching`: É `true` sempre que a queryFn está em execução, incluindo o `pending` inicial, assim como refetches em segundo plano.
  - `paused`: A query queria fazer fetch, mas foi pausada.
  - `idle`: A query não está fazendo fetch.
  - veja [Network Mode](../guides/network-mode.md) para mais informações.
- `isFetching: boolean`
  - Um booleano derivado da variável `fetchStatus` acima, fornecido por conveniência.
- `isPaused: boolean`
  - Um booleano derivado da variável `fetchStatus` acima, fornecido por conveniência.
- `isRefetching: boolean`
  - É `true` sempre que um refetch em segundo plano está em andamento, o que _não_ inclui o `pending` inicial.
  - É o mesmo que `isFetching && !isPending`
- `isLoading: boolean`
  - É `true` sempre que o primeiro fetch de uma query está em andamento.
  - É o mesmo que `isFetching && isPending`
- `isInitialLoading: boolean`
  - **descontinuado**
  - Um alias para `isLoading`, será removido na próxima versão major.
- `isEnabled: boolean`
  - É `true` se este observer de query está habilitado, `false` caso contrário.
- `failureCount: number`
  - A contagem de falhas para a query.
  - Incrementada toda vez que a query falha.
  - Resetada para `0` quando a query é bem-sucedida.
- `failureReason: null | TError`
  - O motivo da falha para a tentativa de retry da query.
  - Resetado para `null` quando a query é bem-sucedida.
- `errorUpdateCount: number`
  - A soma de todos os erros.
- `refetch: (options: { throwOnError: boolean, cancelRefetch: boolean }) => Promise<UseQueryResult>`
  - Uma função para refazer o fetch da query manualmente.
  - Se a query tiver erros, o erro será apenas registrado no log. Se você quiser que um erro seja lançado, passe a opção `throwOnError: true`.
  - `cancelRefetch?: boolean`
    - O padrão é `true`
      - Por padrão, uma requisição em andamento será cancelada antes de uma nova requisição ser feita.
    - Quando definido como `false`, nenhum refetch será feito se já houver uma requisição em andamento.
- `promise: Promise<TData>`
  - Uma promise estável que será resolvida com os dados da query.
  - Requer que a feature flag `experimental_prefetchInRender` esteja habilitada no `QueryClient`.
