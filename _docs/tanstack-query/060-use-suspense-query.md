---
id: useSuspenseQuery
title: useSuspenseQuery
---

```tsx
const result = useSuspenseQuery(options);
```

**Opções**

As mesmas do [useQuery](./useQuery.md), exceto por:

- `throwOnError`
- `enabled`
- `placeholderData`

**Retornos**

Mesmo objeto do [useQuery](./useQuery.md), exceto que:

- `data` é garantido como definido
- `isPlaceholderData` não existe
- `status` é `success` ou `error`
  - as flags derivadas são definidas de acordo.

**Ressalva**

[Cancelamento](../guides/query-cancellation.md) não funciona.
