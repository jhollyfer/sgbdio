---
id: useIsMutating
title: useIsMutating
---

`useIsMutating` é um hook opcional que retorna o `number` de mutations que sua aplicação está executando (útil para indicadores de carregamento globais).

```tsx
import { useIsMutating } from "@tanstack/react-query";
// How many mutations are fetching?
const isMutating = useIsMutating();
// How many mutations matching the posts prefix are fetching?
const isMutatingPosts = useIsMutating({ mutationKey: ["posts"] });
```

**Opções**

- `filters?: MutationFilters`: [Mutation Filters](../guides/filters.md#mutation-filters)
- `queryClient?: QueryClient`
  - Use isto para usar um QueryClient personalizado. Caso contrário, o mais próximo do context será usado.

**Retornos**

- `isMutating: number`
  - Será o `number` de mutations que sua aplicação está atualmente executando.
