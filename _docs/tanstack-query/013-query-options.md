---
id: query-options
title: Query Options
---

Uma das melhores formas de compartilhar `queryKey` e `queryFn` entre múltiplos lugares, mantendo-os co-localizados, é usar o helper `queryOptions`. Em tempo de execução, esse helper apenas retorna o que você passar para ele, mas tem muitas vantagens quando usado [com TypeScript](../typescript.md#typing-query-options). Você pode definir todas as opções possíveis para uma query em um único lugar, e também terá inferência de tipos e segurança de tipos para todas elas.

[//]: # "Example1"

```ts
import { queryOptions } from "@tanstack/react-query";

function groupOptions(id: number) {
  return queryOptions({
    queryKey: ["groups", id],
    queryFn: () => fetchGroups(id),
    staleTime: 5 * 1000,
  });
}

// usage:

useQuery(groupOptions(1));
useSuspenseQuery(groupOptions(5));
useQueries({
  queries: [groupOptions(1), groupOptions(2)],
});
queryClient.prefetchQuery(groupOptions(23));
queryClient.setQueryData(groupOptions(42).queryKey, newGroups);
```

[//]: # "Example1"

Para Queries Infinitas, um helper separado [`infiniteQueryOptions`](../reference/infiniteQueryOptions.md) está disponível.

Você ainda pode sobrescrever algumas opções no nível do component. Um padrão muito comum e útil é criar funções [`select`](./render-optimizations.md#select) por component:

[//]: # "Example2"

```ts
// Type inference still works, so query.data will be the return type of select instead of queryFn

const query = useQuery({
  ...groupOptions(1),
  select: (data) => data.groupName,
});
```

[//]: # "Example2"
