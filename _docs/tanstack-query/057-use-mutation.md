---
id: useMutation
title: useMutation
---

```tsx
const {
  data,
  error,
  isError,
  isIdle,
  isPending,
  isPaused,
  isSuccess,
  failureCount,
  failureReason,
  mutate,
  mutateAsync,
  reset,
  status,
  submittedAt,
  variables,
} = useMutation(
  {
    mutationFn,
    gcTime,
    meta,
    mutationKey,
    networkMode,
    onError,
    onMutate,
    onSettled,
    onSuccess,
    retry,
    retryDelay,
    scope,
    throwOnError,
  },
  queryClient,
);

mutate(variables, {
  onError,
  onSettled,
  onSuccess,
});
```

**Parâmetro 1 (Opções)**

- `mutationFn: (variables: TVariables, context: MutationFunctionContext) => Promise<TData>`
  - **Obrigatório, mas apenas se nenhuma função de mutation padrão tiver sido definida**
  - Uma função que executa uma tarefa assíncrona e retorna uma promise.
  - `variables` é um objeto que `mutate` passará para sua `mutationFn`.
  - `context` é um objeto que `mutate` passará para sua `mutationFn`. Contém referência ao `QueryClient`, `mutationKey` e objeto `meta` opcional.
- `gcTime: number | Infinity`
  - O tempo em milissegundos que dados de cache não utilizados/inativos permanecem na memória. Quando o cache de uma mutation se torna não utilizado ou inativo, esses dados serão removidos por garbage collection após essa duração. Quando tempos de cache diferentes são especificados, o mais longo será usado.
  - Se definido como `Infinity`, desabilitará a garbage collection.
  - Nota: o tempo máximo permitido é de aproximadamente [24 dias](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value), embora seja possível contornar esse limite usando [timeoutManager.setTimeoutProvider](../../../reference/timeoutManager.md#timeoutmanagersettimeoutprovider).
- `mutationKey: unknown[]`
  - Opcional
  - Uma mutation key pode ser definida para herdar padrões configurados com `queryClient.setMutationDefaults`.
- `networkMode: 'online' | 'always' | 'offlineFirst'`
  - Opcional
  - o padrão é `'online'`
  - veja [Network Mode](../guides/network-mode.md) para mais informações.
- `onMutate: (variables: TVariables, context: MutationFunctionContext) => Promise<TOnMutateResult | void> | TOnMutateResult | void`
  - Opcional
  - Esta função será disparada antes da função de mutation ser executada e recebe as mesmas variáveis que a função de mutation receberia.
  - Útil para realizar atualizações otimistas em um recurso na expectativa de que a mutation seja bem-sucedida.
  - O valor retornado por esta função será passado para as funções `onError` e `onSettled` no caso de uma falha na mutation, e pode ser útil para reverter atualizações otimistas.
- `onSuccess: (data: TData, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown`
  - Opcional
  - Esta função será disparada quando a mutation for bem-sucedida e receberá o resultado da mutation.
  - Se uma promise for retornada, ela será aguardada e resolvida antes de prosseguir.
- `onError: (err: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown`
  - Opcional
  - Esta função será disparada se a mutation encontrar um erro e receberá o erro.
  - Se uma promise for retornada, ela será aguardada e resolvida antes de prosseguir.
- `onSettled: (data: TData, error: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown`
  - Opcional
  - Esta função será disparada quando a mutation for bem-sucedida ou encontrar um erro, e receberá os dados ou o erro.
  - Se uma promise for retornada, ela será aguardada e resolvida antes de prosseguir.
- `retry: boolean | number | (failureCount: number, error: TError) => boolean`
  - O padrão é `0`.
  - Se `false`, mutations com falha não serão reexecutadas.
  - Se `true`, mutations com falha serão reexecutadas infinitamente.
  - Se definido como um `number`, ex: `3`, mutations com falha serão reexecutadas até que a contagem de falhas atinja esse número.
- `retryDelay: number | (retryAttempt: number, error: TError) => number`
  - Esta função recebe um inteiro `retryAttempt` e o Error real e retorna o atraso a ser aplicado antes da próxima tentativa em milissegundos.
  - Uma função como `attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)` aplica backoff exponencial.
  - Uma função como `attempt => attempt * 1000` aplica backoff linear.
- `scope: { id: string }`
  - Opcional
  - O padrão é um id único (para que todas as mutations sejam executadas em paralelo)
  - Mutations com o mesmo scope id serão executadas em série.
- `throwOnError: undefined | boolean | (error: TError) => boolean`
  - Defina como `true` se você quiser que erros de mutation sejam lançados na fase de render e propagados para o error boundary mais próximo.
  - Defina como `false` para desabilitar o comportamento de lançar erros para o error boundary.
  - Se definido como uma função, ela receberá o erro e deve retornar um booleano indicando se o erro deve ser mostrado em um error boundary (`true`) ou retornado como state (`false`).
- `meta: Record<string, unknown>`
  - Opcional
  - Se definido, armazena informações adicionais na entrada do mutation cache que podem ser usadas conforme necessário. Estará acessível onde quer que a `mutation` esteja disponível (ex: funções `onError`, `onSuccess` do `MutationCache`).

**Parâmetro 2 (QueryClient)**

- `queryClient?: QueryClient`
  - Use isto para usar um QueryClient personalizado. Caso contrário, o mais próximo do context será usado.

**Retornos**

- `mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void`
  - A função de mutation que você pode chamar com variáveis para acionar a mutation e opcionalmente hooks em opções de callback adicionais.
  - `variables: TVariables`
    - Opcional
    - O objeto de variáveis a ser passado para a `mutationFn`.
  - `onSuccess: (data: TData, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void`
    - Opcional
    - Esta função será disparada quando a mutation for bem-sucedida e receberá o resultado da mutation.
    - Função void, o valor retornado será ignorado.
  - `onError: (err: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void`
    - Opcional
    - Esta função será disparada se a mutation encontrar um erro e receberá o erro.
    - Função void, o valor retornado será ignorado.
  - `onSettled: (data: TData | undefined, error: TError | null, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void`
    - Opcional
    - Esta função será disparada quando a mutation for bem-sucedida ou encontrar um erro, e receberá os dados ou o erro.
    - Função void, o valor retornado será ignorado.
  - Se você fizer múltiplas requisições, `onSuccess` será disparado apenas após a última chamada que você fez.
- `mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>`
  - Similar ao `mutate`, mas retorna uma promise que pode ser aguardada.
- `status: MutationStatus`
  - Será:
    - `idle` status inicial antes da execução da função de mutation.
    - `pending` se a mutation está atualmente em execução.
    - `error` se a última tentativa de mutation resultou em um erro.
    - `success` se a última tentativa de mutation foi bem-sucedida.
- `isIdle`, `isPending`, `isSuccess`, `isError`: variáveis booleanas derivadas de `status`
- `isPaused: boolean`
  - será `true` se a mutation foi pausada.
  - veja [Network Mode](../guides/network-mode.md) para mais informações.
- `data: undefined | unknown`
  - O padrão é `undefined`
  - Os últimos dados resolvidos com sucesso para a mutation.
- `error: null | TError`
  - O objeto de erro para a query, se um erro foi encontrado.
- `reset: () => void`
  - Uma função para limpar o state interno da mutation (ou seja, reseta a mutation para seu state inicial).
- `failureCount: number`
  - A contagem de falhas para a mutation.
  - Incrementada toda vez que a mutation falha.
  - Resetada para `0` quando a mutation é bem-sucedida.
- `failureReason: null | TError`
  - O motivo da falha para a tentativa de retry da mutation.
  - Resetado para `null` quando a mutation é bem-sucedida.
- `submittedAt: number`
  - O timestamp de quando a mutation foi submetida.
  - O padrão é `0`.
- `variables: undefined | TVariables`
  - O objeto `variables` passado para a `mutationFn`.
  - O padrão é `undefined`.
