---
id: useIsFetching
title: useIsFetching
---

`useIsFetching` é um hook opcional que retorna o `number` de queries que sua aplicação está carregando ou buscando em segundo plano (útil para indicadores de carregamento globais).

```tsx
import { useIsFetching } from "@tanstack/react-query";
// How many queries are fetching?
const isFetching = useIsFetching();
// How many queries matching the posts prefix are fetching?
const isFetchingPosts = useIsFetching({ queryKey: ["posts"] });
```

**Opções**

- `filters?: QueryFilters`: [Query Filters](../guides/filters.md#query-filters)
- `queryClient?: QueryClient`
  - Use isto para usar um QueryClient personalizado. Caso contrário, o mais próximo do context será usado.

**Retornos**

- `isFetching: number`
  - Será o `number` de queries que sua aplicação está atualmente carregando ou buscando em segundo plano.
