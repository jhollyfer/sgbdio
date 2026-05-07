---
id: filters
title: Filters
---

Alguns métodos dentro do TanStack Query aceitam um objeto `QueryFilters` ou `MutationFilters`.

## `Query Filters`

Um query filter é um objeto com certas condições para corresponder a uma query:

```tsx
// Cancel all queries
await queryClient.cancelQueries();

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ["posts"], type: "inactive" });

// Refetch all active queries
await queryClient.refetchQueries({ type: "active" });

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ["posts"], type: "active" });
```

Um objeto de query filter suporta as seguintes propriedades:

- `queryKey?: QueryKey`
  - Defina esta propriedade para especificar uma query key para correspondência.
- `exact?: boolean`
  - Se você não quer buscar queries de forma inclusiva pela query key, pode passar a opção `exact: true` para retornar apenas a query com a query key exata que você passou.
- `type?: 'active' | 'inactive' | 'all'`
  - O padrão é `all`
  - Quando definido como `active`, corresponderá a queries ativas.
  - Quando definido como `inactive`, corresponderá a queries inativas.
- `stale?: boolean`
  - Quando definido como `true`, corresponderá a queries stale.
  - Quando definido como `false`, corresponderá a queries fresh.
- `fetchStatus?: FetchStatus`
  - Quando definido como `fetching`, corresponderá a queries que estão sendo buscadas no momento.
  - Quando definido como `paused`, corresponderá a queries que queriam buscar dados, mas foram pausadas.
  - Quando definido como `idle`, corresponderá a queries que não estão buscando dados.
- `predicate?: (query: Query) => boolean`
  - Essa função predicate será usada como um filtro final em todas as queries correspondentes. Se nenhum outro filtro for especificado, essa função será avaliada contra todas as queries no cache.

## `Mutation Filters`

Um mutation filter é um objeto com certas condições para corresponder a uma mutation:

```tsx
// Get the number of all fetching mutations
await queryClient.isMutating();

// Filter mutations by mutationKey
await queryClient.isMutating({ mutationKey: ["post"] });

// Filter mutations using a predicate function
await queryClient.isMutating({
  predicate: (mutation) => mutation.state.variables?.id === 1,
});
```

Um objeto de mutation filter suporta as seguintes propriedades:

- `mutationKey?: MutationKey`
  - Defina esta propriedade para especificar uma mutation key para correspondência.
- `exact?: boolean`
  - Se você não quer buscar mutations de forma inclusiva pela mutation key, pode passar a opção `exact: true` para retornar apenas a mutation com a mutation key exata que você passou.
- `status?: MutationStatus`
  - Permite filtrar mutations de acordo com seu status.
- `predicate?: (mutation: Mutation) => boolean`
  - Essa função predicate será usada como um filtro final em todas as mutations correspondentes. Se nenhum outro filtro for especificado, essa função será avaliada contra todas as mutations no cache.

## Utilitários

### `matchQuery`

```tsx
const isMatching = matchQuery(filters, query);
```

Retorna um booleano que indica se uma query corresponde ao conjunto de query filters fornecido.

### `matchMutation`

```tsx
const isMatching = matchMutation(filters, mutation);
```

Retorna um booleano que indica se uma mutation corresponde ao conjunto de mutation filters fornecido.
