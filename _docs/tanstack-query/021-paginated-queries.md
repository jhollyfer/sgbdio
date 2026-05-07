---
id: paginated-queries
title: Paginated / Lagged Queries
---

Renderizar dados paginados é um padrão de UI muito comum e no TanStack Query, ele "simplesmente funciona" incluindo a informação da página na query key:

[//]: # "Example"

```tsx
const result = useQuery({
  queryKey: ["projects", page],
  queryFn: () => fetchProjects(page),
});
```

[//]: # "Example"

No entanto, se você executar esse exemplo simples, pode notar algo estranho:

**A UI fica alternando entre os states `success` e `pending` porque cada nova página é tratada como uma query completamente nova.**

Essa experiência não é ideal e infelizmente é como muitas ferramentas hoje insistem em funcionar. Mas não o TanStack Query! Como você deve ter adivinhado, o TanStack Query vem com um recurso incrível chamado `placeholderData` que nos permite contornar isso.

## Queries Paginadas Melhores com `placeholderData`

Considere o exemplo a seguir, onde idealmente gostaríamos de incrementar um pageIndex (ou cursor) para uma query. Se usássemos `useQuery`, **ainda funcionaria tecnicamente bem**, mas a UI ficaria alternando entre os states `success` e `pending` conforme diferentes queries são criadas e destruídas para cada página ou cursor. Ao definir `placeholderData` como `(previousData) => previousData` ou a função `keepPreviousData` exportada do TanStack Query, ganhamos algumas coisas novas:

- **Os dados do último fetch bem-sucedido ficam disponíveis enquanto novos dados estão sendo requisitados, mesmo que a query key tenha mudado**.
- Quando os novos dados chegam, os `data` anteriores são trocados perfeitamente para mostrar os novos dados.
- `isPlaceholderData` fica disponível para saber quais dados a query está fornecendo no momento

[//]: # "Example2"

```tsx
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React from "react";

function Todos() {
  const [page, setPage] = React.useState(0);

  const fetchProjects = (page = 0) =>
    fetch("/api/projects?page=" + page).then((res) => res.json());

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["projects", page],
      queryFn: () => fetchProjects(page),
      placeholderData: keepPreviousData,
    });

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPlaceholderData && data.hasMore) {
            setPage((old) => old + 1);
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPlaceholderData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}
    </div>
  );
}
```

[//]: # "Example2"

## Resultados Atrasados de Infinite Query com `placeholderData`

Embora não seja tão comum, a opção `placeholderData` também funciona perfeitamente com o hook `useInfiniteQuery`, permitindo que seus usuários continuem vendo dados em cache enquanto as keys de infinite query mudam ao longo do tempo.
