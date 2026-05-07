---
id: QueryObserver
title: QueryObserver
---

O `QueryObserver` pode ser usado para observar e alternar entre queries.

```tsx
const observer = new QueryObserver(queryClient, { queryKey: ["posts"] });

const unsubscribe = observer.subscribe((result) => {
  console.log(result);
  unsubscribe();
});
```

**Opções**

As opções do `QueryObserver` são exatamente as mesmas do [`useQuery`](../framework/react/reference/useQuery).
