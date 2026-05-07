---
id: usePrefetchQuery
title: usePrefetchQuery
---

```tsx
usePrefetchQuery(options);
```

**Opções**

Você pode passar tudo para `usePrefetchQuery` que pode passar para [`queryClient.prefetchQuery`](../../../reference/QueryClient.md#queryclientprefetchquery). Lembre-se de que algumas opções são obrigatórias conforme abaixo:

- `queryKey: QueryKey`
  - **Obrigatório**
  - A query key para prefetch durante o render

- `queryFn: (context: QueryFunctionContext) => Promise<TData>`
  - **Obrigatório, mas apenas se nenhuma função de query padrão foi definida** Consulte [Função de Query Padrão](../guides/default-query-function.md) para mais informações.

**Retornos**

O `usePrefetchQuery` não retorna nada, ele deve ser usado apenas para disparar um prefetch durante o render, antes de um suspense boundary que envolve um component que usa [`useSuspenseQuery`](./useSuspenseQuery.md).
