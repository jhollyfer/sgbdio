---
id: usePrefetchInfiniteQuery
title: usePrefetchInfiniteQuery
---

```tsx
usePrefetchInfiniteQuery(options);
```

**Opções**

Você pode passar tudo para `usePrefetchInfiniteQuery` que pode passar para [`queryClient.prefetchInfiniteQuery`](../../../reference/QueryClient.md#queryclientprefetchinfinitequery). Lembre-se de que algumas opções são obrigatórias conforme abaixo:

- `queryKey: QueryKey`
  - **Obrigatório**
  - A query key para prefetch durante o render

- `queryFn: (context: QueryFunctionContext) => Promise<TData>`
  - **Obrigatório, mas apenas se nenhuma função de query padrão foi definida** Consulte [Função de Query Padrão](../guides/default-query-function.md) para mais informações.

- `initialPageParam: TPageParam`
  - **Obrigatório**
  - O parâmetro de página padrão a ser usado ao buscar a primeira página.

- `getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => TPageParam | undefined | null`
  - **Obrigatório**
  - Quando novos dados são recebidos para essa query, essa função recebe tanto a última página da lista infinita de dados quanto o array completo de todas as páginas, assim como as informações de pageParam.
  - Ela deve retornar **uma única variável** que será passada como o último parâmetro opcional para a sua função de query.
  - Retorne `undefined` ou `null` para indicar que não há próxima página disponível.

- **Retornos**

O `usePrefetchInfiniteQuery` não retorna nada, ele deve ser usado apenas para disparar um prefetch durante o render, antes de um suspense boundary que envolve um component que usa [`useSuspenseInfiniteQuery`](./useSuspenseInfiniteQuery.md)
