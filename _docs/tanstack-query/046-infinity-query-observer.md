---
id: InfiniteQueryObserver
title: InfiniteQueryObserver
---

## `InfiniteQueryObserver`

O `InfiniteQueryObserver` pode ser usado para observar e alternar entre queries infinitas.

```tsx
const observer = new InfiniteQueryObserver(queryClient, {
  queryKey: ["posts"],
  queryFn: fetchPosts,
  getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
});

const unsubscribe = observer.subscribe((result) => {
  console.log(result);
  unsubscribe();
});
```

**Opções**

As opções do `InfiniteQueryObserver` são exatamente as mesmas do [`useInfiniteQuery`](../framework/react/reference/useInfiniteQuery).
