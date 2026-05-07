---
id: MutationCache
title: MutationCache
---

O `MutationCache` é o armazenamento para mutations.

**Normalmente, você não vai interagir com o MutationCache diretamente e, em vez disso, vai usar o `QueryClient`.**

```tsx
import { MutationCache } from "@tanstack/react-query";

const mutationCache = new MutationCache({
  onError: (error) => {
    console.log(error);
  },
  onSuccess: (data) => {
    console.log(data);
  },
});
```

Os métodos disponíveis são:

- [`getAll`](#mutationcachegetall)
- [`subscribe`](#mutationcachesubscribe)
- [`clear`](#mutationcacheclear)

**Opções**

- `onError?: (error: unknown, variables: unknown, onMutateResult: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - Opcional
  - Essa função será chamada se alguma mutation encontrar um erro.
  - Se você retornar uma Promise dela, ela será aguardada
- `onSuccess?: (data: unknown, variables: unknown, onMutateResult: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - Opcional
  - Essa função será chamada se alguma mutation for bem-sucedida.
  - Se você retornar uma Promise dela, ela será aguardada
- `onSettled?: (data: unknown | undefined, error: unknown | null, variables: unknown, onMutateResult: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - Opcional
  - Essa função será chamada se alguma mutation for finalizada (seja bem-sucedida ou com erro).
  - Se você retornar uma Promise dela, ela será aguardada
- `onMutate?: (variables: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - Opcional
  - Essa função será chamada antes de alguma mutation ser executada.
  - Se você retornar uma Promise dela, ela será aguardada

## Callbacks globais

Os callbacks `onError`, `onSuccess`, `onSettled` e `onMutate` no MutationCache podem ser usados para lidar com esses eventos em nível global. Eles são diferentes das `defaultOptions` fornecidas ao QueryClient porque:

- `defaultOptions` podem ser sobrescritas por cada Mutation - os callbacks globais **sempre** serão chamados.
- `onMutate` não permite retornar um resultado.

## `mutationCache.getAll`

`getAll` retorna todas as mutations dentro do cache.

> Nota: Isso normalmente não é necessário para a maioria das aplicações, mas pode ser útil quando se precisa de mais informações sobre uma mutation em cenários raros

```tsx
const mutations = mutationCache.getAll();
```

**Retorno**

- `Mutation[]`
  - Instâncias de Mutation do cache

## `mutationCache.subscribe`

O método `subscribe` pode ser usado para se inscrever no mutation cache como um todo e ser informado sobre atualizações seguras/conhecidas no cache, como mudanças de estado das mutations ou mutations sendo atualizadas, adicionadas ou removidas.

```tsx
const callback = (event) => {
  console.log(event.type, event.mutation);
};

const unsubscribe = mutationCache.subscribe(callback);
```

**Opções**

- `callback: (mutation?: MutationCacheNotifyEvent) => void`
  - Essa função será chamada com o mutation cache toda vez que ele for atualizado.

**Retorno**

- `unsubscribe: Function => void`
  - Essa função cancelará a inscrição do callback no mutation cache.

## `mutationCache.clear`

O método `clear` pode ser usado para limpar o cache completamente e começar do zero.

```tsx
mutationCache.clear();
```
