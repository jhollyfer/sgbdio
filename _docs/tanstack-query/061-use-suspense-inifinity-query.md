---
id: useSuspenseInfiniteQuery
title: useSuspenseInfiniteQuery
---

```tsx
const result = useSuspenseInfiniteQuery(options);
```

**Opções**

As mesmas do [useInfiniteQuery](./useInfiniteQuery.md), exceto por:

- `suspense`
- `throwOnError`
- `enabled`
- `placeholderData`

**Retornos**

Mesmo objeto do [useInfiniteQuery](./useInfiniteQuery.md), exceto que:

- `data` é garantido como definido
- `isPlaceholderData` não existe
- `status` é `success` ou `error`
  - as flags derivadas são definidas de acordo.

**Ressalva**

[Cancelamento](../guides/query-cancellation.md) não funciona.
