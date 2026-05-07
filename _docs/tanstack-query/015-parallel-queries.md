---
id: parallel-queries
title: Parallel Queries
---

Queries "paralelas" são queries que são executadas em paralelo, ou ao mesmo tempo, para maximizar a concorrência de fetching.

## Queries Paralelas Manuais

Quando o número de queries paralelas não muda, **não é necessário nenhum esforço extra** para usar queries paralelas. Basta usar quantos hooks `useQuery` e `useInfiniteQuery` do TanStack Query você quiser lado a lado!

[//]: # "Example"

```tsx
function App () {
  // The following queries will execute in parallel
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  ...
}
```

[//]: # "Example"
[//]: # "Info"

> Ao usar React Query no modo suspense, esse padrão de paralelismo não funciona, pois a primeira query lançaria uma promise internamente e suspenderia o component antes das outras queries serem executadas. Para contornar isso, você precisará usar o hook `useSuspenseQueries` (que é o recomendado) ou orquestrar seu próprio paralelismo com components separados para cada instância de `useSuspenseQuery`.

[//]: # "Info"

## Queries Paralelas Dinâmicas com `useQueries`

[//]: # "DynamicParallelIntro"

Se o número de queries que você precisa executar muda de render para render, você não pode usar queries manuais, pois isso violaria as regras dos hooks. Em vez disso, o TanStack Query fornece o hook `useQueries`, que você pode usar para executar dinamicamente quantas queries em paralelo quiser.

[//]: # "DynamicParallelIntro"

`useQueries` aceita um **objeto de opções** com uma **chave queries** cujo valor é um **array de objetos de query**. Ele retorna um **array de resultados de query**:

[//]: # "Example2"

```tsx
function App({ users }) {
  const userQueries = useQueries({
    queries: users.map((user) => {
      return {
        queryKey: ["user", user.id],
        queryFn: () => fetchUserById(user.id),
      };
    }),
  });
}
```

[//]: # "Example2"
