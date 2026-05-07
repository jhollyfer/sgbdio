---
id: query-functions
title: Query Functions
---

Uma função de query pode ser literalmente qualquer função que **retorna uma promise**. A promise retornada deve **resolver os dados** ou **lançar um erro**.

Todas as configurações de função de query a seguir são válidas:

[//]: # "Example"

```tsx
useQuery({ queryKey: ["todos"], queryFn: fetchAllTodos });
useQuery({ queryKey: ["todos", todoId], queryFn: () => fetchTodoById(todoId) });
useQuery({
  queryKey: ["todos", todoId],
  queryFn: async () => {
    const data = await fetchTodoById(todoId);
    return data;
  },
});
useQuery({
  queryKey: ["todos", todoId],
  queryFn: ({ queryKey }) => fetchTodoById(queryKey[1]),
});
```

[//]: # "Example"

## Tratando e Lançando Erros

Para que o TanStack Query determine que uma query teve erro, a função de query **deve lançar** ou retornar uma **Promise rejeitada**. Qualquer erro lançado na função de query será persistido no state `error` da query.

[//]: # "Example2"

```tsx
const { error } = useQuery({
  queryKey: ["todos", todoId],
  queryFn: async () => {
    if (somethingGoesWrong) {
      throw new Error("Oh no!");
    }
    if (somethingElseGoesWrong) {
      return Promise.reject(new Error("Oh no!"));
    }

    return data;
  },
});
```

[//]: # "Example2"

## Uso com `fetch` e outros clientes que não lançam erros por padrão

Embora a maioria dos utilitários como `axios` ou `graphql-request` lancem erros automaticamente para chamadas HTTP malsucedidas, alguns utilitários como `fetch` não lançam erros por padrão. Se esse for o caso, você precisará lançá-los por conta própria. Aqui está uma maneira simples de fazer isso com a popular API `fetch`:

[//]: # "Example3"

```tsx
useQuery({
  queryKey: ["todos", todoId],
  queryFn: async () => {
    const response = await fetch("/todos/" + todoId);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },
});
```

[//]: # "Example3"

## Variáveis da Função de Query

As query keys não servem apenas para identificar de forma única os dados que você está buscando, mas também são convenientemente passadas para sua função de query como parte do QueryFunctionContext. Embora nem sempre seja necessário, isso torna possível extrair suas funções de query quando necessário:

[//]: # "Example4"

```tsx
function Todos({ status, page }) {
  const result = useQuery({
    queryKey: ["todos", { status, page }],
    queryFn: fetchTodoList,
  });
}

// Access the key, status and page variables in your query function!
function fetchTodoList({ queryKey }) {
  const [_key, { status, page }] = queryKey;
  return new Promise();
}
```

[//]: # "Example4"

### QueryFunctionContext

O `QueryFunctionContext` é o objeto passado para cada função de query. Ele consiste em:

- `queryKey: QueryKey`: [Query Keys](./query-keys.md)
- `client: QueryClient`: [QueryClient](../../../reference/QueryClient.md)
- `signal?: AbortSignal`
  - Instância de [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) fornecida pelo TanStack Query
  - Pode ser usada para [Cancelamento de Queries](./query-cancellation.md)
- `meta: Record<string, unknown> | undefined`
  - um campo opcional que você pode preencher com informações adicionais sobre sua query

Adicionalmente, [Queries Infinitas](./infinite-queries.md) recebem as seguintes opções:

- `pageParam: TPageParam`
  - o parâmetro de página usado para buscar a página atual
- `direction: 'forward' | 'backward'`
  - **descontinuado**
  - a direção do fetch da página atual
  - Para ter acesso à direção do fetch da página atual, adicione uma direção ao `pageParam` a partir de `getNextPageParam` e `getPreviousPageParam`.
