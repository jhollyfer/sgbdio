---
id: useQueryClient
title: useQueryClient
---

O hook `useQueryClient` retorna a instância atual do `QueryClient`.

```tsx
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient(queryClient?: QueryClient)
```

**Opções**

- `queryClient?: QueryClient`
  - Use isso para utilizar um QueryClient personalizado. Caso contrário, será usado o do context mais próximo.
