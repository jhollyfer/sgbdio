---
id: infiniteQueryOptions
title: infiniteQueryOptions
---

```tsx
infiniteQueryOptions({
  queryKey,
  ...options,
});
```

**Opções**

Você geralmente pode passar tudo para `infiniteQueryOptions` que também pode passar para [`useInfiniteQuery`](./useInfiniteQuery.md). Algumas opções não terão efeito quando encaminhadas para uma função como `queryClient.prefetchInfiniteQuery`, mas o TypeScript ainda aceitará essas propriedades extras.

- `queryKey: QueryKey`
  - **Obrigatório**
  - A query key para gerar as opções.

Consulte [useInfiniteQuery](./useInfiniteQuery.md) para mais informações.
