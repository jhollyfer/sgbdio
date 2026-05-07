---
id: query-retries
title: Query Retries
---

Quando uma query do `useQuery` falha (a função da query lança um erro), o TanStack Query vai automaticamente tentar novamente a query se aquela requisição não tiver atingido o número máximo de tentativas consecutivas (o padrão é `3`) ou se uma função for fornecida para determinar se uma nova tentativa é permitida.

Você pode configurar as tentativas tanto em nível global quanto em nível individual de query.

- Definir `retry = false` vai desabilitar as tentativas.
- Definir `retry = 6` vai tentar novamente requisições que falharam 6 vezes antes de mostrar o erro final lançado pela função.
- Definir `retry = true` vai tentar novamente requisições que falharam infinitamente.
- Definir `retry = (failureCount, error) => ...` permite uma lógica personalizada baseada no motivo da falha da requisição. Note que `failureCount` começa em `0` para a primeira tentativa.

[//]: # "Info"

> No servidor, as tentativas têm o padrão de `0` para tornar o rendering no servidor o mais rápido possível.

[//]: # "Info"
[//]: # "Example"

```tsx
import { useQuery } from "@tanstack/react-query";

// Make a specific query retry a certain number of times
const result = useQuery({
  queryKey: ["todos", 1],
  queryFn: fetchTodoListPage,
  retry: 10, // Will retry failed requests 10 times before displaying an error
});
```

[//]: # "Example"

> Info: O conteúdo da propriedade `error` fará parte da propriedade de resposta `failureReason` do `useQuery` até a última tentativa. Então, no exemplo acima, qualquer conteúdo de erro fará parte da propriedade `failureReason` pelas primeiras 9 tentativas (10 tentativas no total) e finalmente fará parte de `error` após a última tentativa, se o erro persistir após todas as tentativas.

## Atraso entre Tentativas

Por padrão, as tentativas no TanStack Query não acontecem imediatamente após uma requisição falhar. Como é padrão, um atraso com back-off é aplicado gradualmente a cada tentativa.

O `retryDelay` padrão é configurado para dobrar (começando em `1000`ms) a cada tentativa, mas sem exceder 30 segundos:

[//]: # "Example2"

```tsx
// Configure for all queries
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

[//]: # "Example2"

Embora não seja recomendado, você pode obviamente sobrescrever a função/inteiro `retryDelay` tanto no Provider quanto nas opções individuais de query. Se definido como um inteiro em vez de uma função, o atraso será sempre o mesmo:

[//]: # "Example3"

```tsx
const result = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodoList,
  retryDelay: 1000, // Will always wait 1000ms to retry, regardless of how many retries
});
```

[//]: # "Example3"

## Comportamento de Tentativas em Background

Ao usar `refetchInterval` com `refetchIntervalInBackground: true`, as tentativas serão pausadas quando a aba do navegador estiver inativa. Isso acontece porque as tentativas respeitam o mesmo comportamento de foco que os refetches regulares.

Se você precisar de tentativas contínuas em background, considere desabilitar as tentativas e implementar uma estratégia personalizada de refetch:

[//]: # "Example4"

```tsx
const result = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  refetchInterval: (query) => {
    // Refetch more frequently when in error state
    return query.state.status === "error" ? 5000 : 30000;
  },
  refetchIntervalInBackground: true,
  retry: false, // Disable built-in retries
});
```

[//]: # "Example4"

Essa abordagem permite que você controle o tempo das tentativas manualmente enquanto mantém os refetches ativos em background.
