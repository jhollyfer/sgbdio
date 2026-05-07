---
id: QueriesObserver
title: QueriesObserver
---

## `QueriesObserver`

O `QueriesObserver` pode ser usado para observar múltiplas queries.

```tsx
const observer = new QueriesObserver(queryClient, [
  { queryKey: ["post", 1], queryFn: fetchPost },
  { queryKey: ["post", 2], queryFn: fetchPost },
]);

const unsubscribe = observer.subscribe((result) => {
  console.log(result);
  unsubscribe();
});
```

**Opções**

As opções do `QueriesObserver` são exatamente as mesmas do [`useQueries`](../framework/react/reference/useQueries).
