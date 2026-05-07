---
id: QueryClientProvider
title: QueryClientProvider
---

Use o component `QueryClientProvider` para conectar e fornecer um `QueryClient` à sua aplicação:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

**Opções**

- `client: QueryClient`
  - **Obrigatório**
  - a instância do QueryClient a ser fornecida
