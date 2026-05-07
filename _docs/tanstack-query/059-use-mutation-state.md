---
id: useMutationState
title: useMutationState
---

`useMutationState` é um hook que dá acesso a todas as mutations no `MutationCache`. Você pode passar `filters` para filtrar suas mutations, e `select` para transformar o state da mutation.

**Exemplo 1: Obter todas as variáveis de todas as mutations em execução**

```tsx
import { useMutationState } from "@tanstack/react-query";

const variables = useMutationState({
  filters: { status: "pending" },
  select: (mutation) => mutation.state.variables,
});
```

**Exemplo 2: Obter todos os dados de mutations específicas via `mutationKey`**

```tsx
import { useMutation, useMutationState } from "@tanstack/react-query";

const mutationKey = ["posts"];

// Some mutation that we want to get the state for
const mutation = useMutation({
  mutationKey,
  mutationFn: (newPost) => {
    return axios.post("/posts", newPost);
  },
});

const data = useMutationState({
  // this mutation key needs to match the mutation key of the given mutation (see above)
  filters: { mutationKey },
  select: (mutation) => mutation.state.data,
});
```

**Exemplo 3: Acessar os dados da mutation mais recente via `mutationKey`**.
Cada invocação de `mutate` adiciona uma nova entrada no mutation cache por `gcTime` milissegundos.

Para acessar a invocação mais recente, você pode verificar o último item que `useMutationState` retorna.

```tsx
import { useMutation, useMutationState } from "@tanstack/react-query";

const mutationKey = ["posts"];

// Some mutation that we want to get the state for
const mutation = useMutation({
  mutationKey,
  mutationFn: (newPost) => {
    return axios.post("/posts", newPost);
  },
});

const data = useMutationState({
  // this mutation key needs to match the mutation key of the given mutation (see above)
  filters: { mutationKey },
  select: (mutation) => mutation.state.data,
});

// Latest mutation data
const latest = data[data.length - 1];
```

**Opções**

- `options`
  - `filters?: MutationFilters`: [Mutation Filters](../guides/filters.md#mutation-filters)
  - `select?: (mutation: Mutation) => TResult`
    - Use isto para transformar o state da mutation.
- `queryClient?: QueryClient`
  - Use isto para usar um QueryClient personalizado. Caso contrário, o mais próximo do context será usado.

**Retornos**

- `Array<TResult>`
  - Será um Array com o que `select` retorna para cada mutation correspondente.
