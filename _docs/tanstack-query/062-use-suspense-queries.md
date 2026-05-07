---
id: useSuspenseQueries
title: useSuspenseQueries
---

```tsx
const result = useSuspenseQueries(options);
```

**Opções**

As mesmas do [useQueries](./useQueries.md), exceto que cada `query` não pode ter:

- `suspense`
- `throwOnError`
- `enabled`
- `placeholderData`

**Retornos**

Mesma estrutura do [useQueries](./useQueries.md), exceto que para cada `query`:

- `data` é garantido como definido
- `isPlaceholderData` não existe
- `status` é `success` ou `error`
  - as flags derivadas são definidas de acordo.

**Ressalvas**

Tenha em mente que o component só será remontado depois que **todas as queries** terminarem de carregar. Portanto, se uma query ficou stale no tempo que levou para todas as queries serem concluídas, ela será buscada novamente na remontagem. Para evitar isso, certifique-se de definir um `staleTime` alto o suficiente.

[Cancelamento](../guides/query-cancellation.md) não funciona.
