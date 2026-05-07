---
id: initial-query-data
title: Initial Query Data
---

Existem várias maneiras de fornecer dados iniciais para uma query no cache antes de você precisar deles:

- Declarativamente:
  - Fornecer `initialData` a uma query para pré-popular seu cache se estiver vazio
- Imperativamente:
  - [Prefetch dos dados usando `queryClient.prefetchQuery`](./prefetching.md)
  - [Colocar manualmente os dados no cache usando `queryClient.setQueryData`](./prefetching.md)

## Usando `initialData` para pré-popular uma query

Pode haver momentos em que você já tem os dados iniciais para uma query disponíveis na sua aplicação e pode simplesmente fornecê-los diretamente à sua query. Se e quando esse for o caso, você pode usar a opção `config.initialData` para definir os dados iniciais de uma query e pular o state de carregamento inicial!

> IMPORTANTE: `initialData` é persistido no cache, então não é recomendado fornecer dados placeholder, parciais ou incompletos para essa opção. Em vez disso, use `placeholderData`

[//]: # "Example"

```tsx
const result = useQuery({
  queryKey: ["todos"],
  queryFn: () => fetch("/todos"),
  initialData: initialTodos,
});
```

[//]: # "Example"

### `staleTime` e `initialDataUpdatedAt`

Por padrão, `initialData` é tratado como totalmente fresh, como se tivesse acabado de ser buscado. Isso também significa que afetará como será interpretado pela opção `staleTime`.

- Se você configurar seu query observer com `initialData`, e sem `staleTime` (o padrão `staleTime: 0`), a query vai imediatamente fazer refetch quando for montada:

  [//]: # "Example2"

  ```tsx
  // Will show initialTodos immediately, but also immediately refetch todos after mount
  const result = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/todos"),
    initialData: initialTodos,
  });
  ```

  [//]: # "Example2"

- Se você configurar seu query observer com `initialData` e um `staleTime` de `1000` ms, os dados serão considerados fresh pela mesma quantidade de tempo, como se tivessem acabado de ser buscados pela sua função de query.

  [//]: # "Example3"

  ```tsx
  // Show initialTodos immediately, but won't refetch until another interaction event is encountered after 1000 ms
  const result = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/todos"),
    initialData: initialTodos,
    staleTime: 1000,
  });
  ```

  [//]: # "Example3"

- E se o seu `initialData` não estiver totalmente fresh? Isso nos leva à última configuração, que é na verdade a mais precisa, e usa uma opção chamada `initialDataUpdatedAt`. Essa opção permite que você passe um timestamp numérico JavaScript em milissegundos de quando o initialData foi atualizado pela última vez, por exemplo, o que `Date.now()` fornece. Note que se você tiver um timestamp unix, precisará convertê-lo para um timestamp JavaScript multiplicando por `1000`.

  [//]: # "Example4"

  ```tsx
  // Show initialTodos immediately, but won't refetch until another interaction event is encountered after 1000 ms
  const result = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/todos"),
    initialData: initialTodos,
    staleTime: 60 * 1000, // 1 minute
    // This could be 10 seconds ago or 10 minutes ago
    initialDataUpdatedAt: initialTodosUpdatedTimestamp, // eg. 1608412420052
  });
  ```

  [//]: # "Example4"

  Essa opção permite que o staleTime seja usado para seu propósito original, determinar quão fresh os dados precisam estar, enquanto também permite que os dados sejam revalidados na montagem se o `initialData` for mais antigo que o `staleTime`. No exemplo acima, nossos dados precisam estar fresh dentro de 1 minuto, e podemos indicar à query quando o initialData foi atualizado pela última vez para que a query possa decidir por conta própria se os dados precisam ser buscados novamente ou não.

  > Se você preferir tratar seus dados como **dados prefetched**, recomendamos que use as APIs `prefetchQuery` ou `fetchQuery` para popular o cache previamente, permitindo assim que você configure seu `staleTime` independentemente do seu initialData

### Função de Dados Iniciais

Se o processo para acessar os dados iniciais de uma query for intensivo ou simplesmente não for algo que você queira realizar a cada render, você pode passar uma função como o valor de `initialData`. Essa função será executada apenas uma vez quando a query for inicializada, economizando memória e/ou CPU preciosos:

[//]: # "Example5"

```tsx
const result = useQuery({
  queryKey: ["todos"],
  queryFn: () => fetch("/todos"),
  initialData: () => getExpensiveTodos(),
});
```

[//]: # "Example5"

### Dados Iniciais do Cache

Em algumas circunstâncias, você pode conseguir fornecer os dados iniciais para uma query a partir do resultado em cache de outra. Um bom exemplo disso seria buscar nos dados em cache de uma query de lista de todos um item individual de todo, e então usar isso como os dados iniciais para a query individual desse todo:

[//]: # "Example6"

```tsx
const result = useQuery({
  queryKey: ["todo", todoId],
  queryFn: () => fetch("/todos"),
  initialData: () => {
    // Use a todo from the 'todos' query as the initial data for this todo query
    return queryClient.getQueryData(["todos"])?.find((d) => d.id === todoId);
  },
});
```

[//]: # "Example6"

### Dados Iniciais do cache com `initialDataUpdatedAt`

Obter dados iniciais do cache significa que a query de origem que você está usando para buscar os dados iniciais provavelmente é antiga. Em vez de usar um `staleTime` artificial para evitar que sua query faça refetch imediatamente, é sugerido que você passe o `dataUpdatedAt` da query de origem para `initialDataUpdatedAt`. Isso fornece à instância da query todas as informações necessárias para determinar se e quando a query precisa ser revalidada, independentemente de dados iniciais terem sido fornecidos.

[//]: # "Example7"

```tsx
const result = useQuery({
  queryKey: ["todos", todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () =>
    queryClient.getQueryData(["todos"])?.find((d) => d.id === todoId),
  initialDataUpdatedAt: () =>
    queryClient.getQueryState(["todos"])?.dataUpdatedAt,
});
```

[//]: # "Example7"

### Dados Iniciais Condicionais do Cache

Se a query de origem que você está usando para buscar os dados iniciais for antiga, você pode não querer usar os dados em cache de forma alguma e simplesmente buscar do servidor. Para facilitar essa decisão, você pode usar o método `queryClient.getQueryState` para obter mais informações sobre a query de origem, incluindo um timestamp `state.dataUpdatedAt` que você pode usar para decidir se a query é "fresh" o suficiente para suas necessidades:

[//]: # "Example8"

```tsx
const result = useQuery({
  queryKey: ["todo", todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () => {
    // Get the query state
    const state = queryClient.getQueryState(["todos"]);

    // If the query exists and has data that is no older than 10 seconds...
    if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
      // return the individual todo
      return state.data.find((d) => d.id === todoId);
    }

    // Otherwise, return undefined and let it fetch from a hard loading state!
  },
});
```

[//]: # "Example8"
[//]: # "Materials"

## Leitura complementar

Para uma comparação entre `Initial Data` e `Placeholder Data`, veja o [artigo do TkDodo](https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query).

[//]: # "Materials"
