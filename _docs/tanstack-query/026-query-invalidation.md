---
id: query-invalidation
title: Query Invalidation
---

Esperar que queries se tornem stale antes de buscá-las novamente nem sempre funciona, especialmente quando você sabe com certeza que os dados de uma query estão desatualizados por causa de algo que o usuário fez. Para esse propósito, o `QueryClient` tem um método `invalidateQueries` que permite marcar queries como stale de forma inteligente e potencialmente fazer refetch delas também!

[//]: # "Example"

```tsx
// Invalidate every query in the cache
queryClient.invalidateQueries();
// Invalidate every query with a key that starts with `todos`
queryClient.invalidateQueries({ queryKey: ["todos"] });
```

[//]: # "Example"

> Nota: Enquanto outras bibliotecas que usam caches normalizados tentariam atualizar queries locais com os novos dados de forma imperativa ou por inferência de schema, o TanStack Query fornece as ferramentas para evitar o trabalho manual que vem com a manutenção de caches normalizados e, em vez disso, prescreve **invalidação direcionada, refetching em segundo plano e, por fim, atualizações atômicas**.

Quando uma query é invalidada com `invalidateQueries`, duas coisas acontecem:

- Ela é marcada como stale. Esse state stale sobrescreve qualquer configuração de `staleTime` usada no `useQuery` ou hooks relacionados
- Se a query estiver sendo renderizada atualmente via `useQuery` ou hooks relacionados, ela também sofrerá refetch em segundo plano

## Correspondência de Queries com `invalidateQueries`

Ao usar APIs como `invalidateQueries` e `removeQueries` (e outras que suportam correspondência parcial de queries), você pode corresponder múltiplas queries pelo prefixo, ou ser bem específico e corresponder uma query exata. Para informações sobre os tipos de filtros que você pode usar, veja [Query Filters](./filters.md#query-filters).

Neste exemplo, podemos usar o prefixo `todos` para invalidar qualquer query que comece com `todos` na sua query key:

[//]: # "Example2"

```tsx
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Get QueryClient from the context
const queryClient = useQueryClient();

queryClient.invalidateQueries({ queryKey: ["todos"] });

// Both queries below will be invalidated
const todoListQuery = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodoList,
});
const todoListQuery = useQuery({
  queryKey: ["todos", { page: 1 }],
  queryFn: fetchTodoList,
});
```

[//]: # "Example2"

Você também pode invalidar queries com variáveis específicas passando uma query key mais específica para o método `invalidateQueries`:

[//]: # "Example3"

```tsx
queryClient.invalidateQueries({
  queryKey: ["todos", { type: "done" }],
});

// The query below will be invalidated
const todoListQuery = useQuery({
  queryKey: ["todos", { type: "done" }],
  queryFn: fetchTodoList,
});

// However, the following query below will NOT be invalidated
const todoListQuery = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodoList,
});
```

[//]: # "Example3"

A API `invalidateQueries` é muito flexível, então mesmo que você queira invalidar **apenas** queries de `todos` que não tenham mais variáveis ou subchaves, você pode passar a opção `exact: true` para o método `invalidateQueries`:

[//]: # "Example4"

```tsx
queryClient.invalidateQueries({
  queryKey: ["todos"],
  exact: true,
});

// The query below will be invalidated
const todoListQuery = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodoList,
});

// However, the following query below will NOT be invalidated
const todoListQuery = useQuery({
  queryKey: ["todos", { type: "done" }],
  queryFn: fetchTodoList,
});
```

[//]: # "Example4"

Se você quiser **ainda mais** granularidade, pode passar uma função predicate para o método `invalidateQueries`. Essa função receberá cada instância de `Query` do cache de queries e permitirá que você retorne `true` ou `false` para decidir se deseja invalidar aquela query:

[//]: # "Example5"

```tsx
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === "todos" && query.queryKey[1]?.version >= 10,
});

// The query below will be invalidated
const todoListQuery = useQuery({
  queryKey: ["todos", { version: 20 }],
  queryFn: fetchTodoList,
});

// The query below will be invalidated
const todoListQuery = useQuery({
  queryKey: ["todos", { version: 10 }],
  queryFn: fetchTodoList,
});

// However, the following query below will NOT be invalidated
const todoListQuery = useQuery({
  queryKey: ["todos", { version: 5 }],
  queryFn: fetchTodoList,
});
```

[//]: # "Example5"
