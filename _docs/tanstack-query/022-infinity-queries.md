---
id: infinite-queries
title: Infinite Queries
---

Renderizar listas que podem "carregar mais" dados adicionalmente a um conjunto existente de dados ou "scroll infinito" também é um padrão de UI muito comum. O TanStack Query suporta uma versão útil do `useQuery` chamada `useInfiniteQuery` para consultar esses tipos de listas.

Ao usar `useInfiniteQuery`, você vai notar que algumas coisas são diferentes:

- `data` agora é um objeto contendo os dados da infinite query:
- O array `data.pages` contendo as páginas buscadas
- O array `data.pageParams` contendo os parâmetros de página usados para buscar as páginas
- As funções `fetchNextPage` e `fetchPreviousPage` agora estão disponíveis (`fetchNextPage` é obrigatória)
- A opção `initialPageParam` agora está disponível (e é obrigatória) para especificar o parâmetro de página inicial
- As opções `getNextPageParam` e `getPreviousPageParam` estão disponíveis para determinar se há mais dados para carregar e a informação para buscá-los. Essa informação é fornecida como um parâmetro adicional na função da query
- Um booleano `hasNextPage` agora está disponível e é `true` se `getNextPageParam` retornar um valor diferente de `null` ou `undefined`
- Um booleano `hasPreviousPage` agora está disponível e é `true` se `getPreviousPageParam` retornar um valor diferente de `null` ou `undefined`
- Os booleanos `isFetchingNextPage` e `isFetchingPreviousPage` agora estão disponíveis para distinguir entre um state de atualização em background e um state de carregamento de mais dados

> Nota: As opções `initialData` ou `placeholderData` precisam estar em conformidade com a mesma estrutura de um objeto com as propriedades `data.pages` e `data.pageParams`.

## Exemplo

Vamos supor que temos uma API que retorna páginas de `projects` de 3 em 3, baseada em um índice `cursor`, junto com um cursor que pode ser usado para buscar o próximo grupo de projetos:

```tsx
fetch("/api/projects?cursor=0");
// { data: [...], nextCursor: 3}
fetch("/api/projects?cursor=3");
// { data: [...], nextCursor: 6}
fetch("/api/projects?cursor=6");
// { data: [...], nextCursor: 9}
fetch("/api/projects?cursor=9");
// { data: [...] }
```

Com essa informação, podemos criar uma UI de "Carregar Mais" assim:

- Esperando o `useInfiniteQuery` requisitar o primeiro grupo de dados por padrão
- Retornando a informação para a próxima query em `getNextPageParam`
- Chamando a função `fetchNextPage`

[//]: # "Example"

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";

function Projects() {
  const fetchProjects = async ({ pageParam }) => {
    const res = await fetch("/api/projects?cursor=" + pageParam);
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}
```

[//]: # "Example"

É essencial entender que chamar `fetchNextPage` enquanto um fetch está em andamento corre o risco de sobrescrever atualizações de dados acontecendo em background. Essa situação se torna particularmente crítica ao renderizar uma lista e disparar `fetchNextPage` simultaneamente.

Lembre-se, só pode haver um único fetch em andamento para uma InfiniteQuery. Uma única entrada no cache é compartilhada para todas as páginas, tentar buscar duas vezes simultaneamente pode levar a sobrescritas de dados.

Se você pretende habilitar fetching simultâneo, pode utilizar a opção `{ cancelRefetch: false }` (padrão: true) dentro de `fetchNextPage`.

Para garantir um processo de consulta suave e sem conflitos, é altamente recomendado verificar que a query não está em um state `isFetching`, especialmente se o usuário não controla diretamente essa chamada.

[//]: # "Example1"

```jsx
<List onEndReached={() => hasNextPage && !isFetching && fetchNextPage()} />
```

[//]: # "Example1"

## O que acontece quando uma infinite query precisa ser revalidada?

Quando uma infinite query se torna stale e precisa ser revalidada, cada grupo é buscado `sequencialmente`, começando pelo primeiro. Isso garante que mesmo que os dados subjacentes sejam alterados, não estamos usando cursores stale e potencialmente obtendo duplicatas ou pulando registros. Se os resultados de uma infinite query forem removidos do queryCache, a paginação reinicia no state inicial com apenas o grupo inicial sendo requisitado.

## E se eu quiser implementar uma lista infinita bidirecional?

Listas bidirecionais podem ser implementadas usando as propriedades e funções `getPreviousPageParam`, `fetchPreviousPage`, `hasPreviousPage` e `isFetchingPreviousPage`.

[//]: # "Example3"

```tsx
useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
});
```

[//]: # "Example3"

## E se eu quiser mostrar as páginas em ordem invertida?

Às vezes você pode querer mostrar as páginas em ordem invertida. Se esse for o caso, você pode usar a opção `select`:

[//]: # "Example4"

```tsx
useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  select: (data) => ({
    pages: [...data.pages].reverse(),
    pageParams: [...data.pageParams].reverse(),
  }),
});
```

[//]: # "Example4"

## E se eu quiser atualizar manualmente a infinite query?

### Removendo manualmente a primeira página:

[//]: # "Example5"

```tsx
queryClient.setQueryData(["projects"], (data) => ({
  pages: data.pages.slice(1),
  pageParams: data.pageParams.slice(1),
}));
```

[//]: # "Example5"

### Removendo manualmente um único valor de uma página individual:

[//]: # "Example6"

```tsx
const newPagesArray =
  oldPagesArray?.pages.map((page) =>
    page.filter((val) => val.id !== updatedId),
  ) ?? [];

queryClient.setQueryData(["projects"], (data) => ({
  pages: newPagesArray,
  pageParams: data.pageParams,
}));
```

[//]: # "Example6"

### Manter apenas a primeira página:

[//]: # "Example7"

```tsx
queryClient.setQueryData(["projects"], (data) => ({
  pages: data.pages.slice(0, 1),
  pageParams: data.pageParams.slice(0, 1),
}));
```

[//]: # "Example7"

Certifique-se de sempre manter a mesma estrutura de dados de pages e pageParams!

## E se eu quiser limitar o número de páginas?

Em alguns casos de uso, você pode querer limitar o número de páginas armazenadas nos dados da query para melhorar a performance e a UX:

- quando o usuário pode carregar um grande número de páginas (uso de memória)
- quando você precisa revalidar uma infinite query que contém dezenas de páginas (uso de rede: todas as páginas são buscadas sequencialmente)

A solução é usar uma "Infinite Query Limitada". Isso é possível usando a opção `maxPages` em conjunto com `getNextPageParam` e `getPreviousPageParam` para permitir buscar páginas quando necessário em ambas as direções.

No exemplo a seguir, apenas 3 páginas são mantidas no array de páginas dos dados da query. Se uma revalidação for necessária, apenas 3 páginas serão buscadas sequencialmente.

[//]: # "Example8"

```tsx
useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
  maxPages: 3,
});
```

[//]: # "Example8"

## E se minha API não retornar um cursor?

Se sua API não retorna um cursor, você pode usar o `pageParam` como cursor. Como `getNextPageParam` e `getPreviousPageParam` também recebem o `pageParam` da página atual, você pode usá-lo para calcular o parâmetro da próxima/anterior página.

[//]: # "Example9"

```tsx
return useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages, lastPageParam) => {
    if (lastPage.length === 0) {
      return undefined;
    }
    return lastPageParam + 1;
  },
  getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
    if (firstPageParam <= 1) {
      return undefined;
    }
    return firstPageParam - 1;
  },
});
```

[//]: # "Example9"
[//]: # "Materials"

## Leitura complementar

Para entender melhor como Infinite Queries funcionam por baixo dos panos, veja o artigo [How Infinite Queries work](https://tkdodo.eu/blog/how-infinite-queries-work).

[//]: # "Materials"
