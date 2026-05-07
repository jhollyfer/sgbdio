---
id: QueryCache
title: QueryCache
---

O `QueryCache` é o mecanismo de armazenamento do TanStack Query. Ele armazena todos os dados, metainformações e state das queries que contém.

**Normalmente, você não vai interagir com o QueryCache diretamente e, em vez disso, vai usar o `QueryClient` para um cache específico.**

```tsx
import { QueryCache } from "@tanstack/react-query";

const queryCache = new QueryCache({
  onError: (error) => {
    console.log(error);
  },
  onSuccess: (data) => {
    console.log(data);
  },
  onSettled: (data, error) => {
    console.log(data, error);
  },
});

const query = queryCache.find(["posts"]);
```

Os métodos disponíveis são:

- [`queryCache.find`](#querycachefind)
- [`queryCache.findAll`](#querycachefindall)
- [`queryCache.subscribe`](#querycachesubscribe)
- [`queryCache.clear`](#querycacheclear)
- [Leitura complementar](#further-reading)

**Opções**

- `onError?: (error: unknown, query: Query) => void`
  - Opcional
  - Essa função será chamada se alguma query encontrar um erro.
- `onSuccess?: (data: unknown, query: Query) => void`
  - Opcional
  - Essa função será chamada se alguma query for bem-sucedida.
- `onSettled?: (data: unknown | undefined, error: unknown | null, query: Query) => void`
  - Opcional
  - Essa função será chamada se alguma query for finalizada (seja bem-sucedida ou com erro).

## `queryCache.find`

`find` é um método síncrono um pouco mais avançado que pode ser usado para obter uma instância de query existente do cache. Essa instância não contém apenas **todo** o state da query, mas também todas as instâncias e os detalhes internos da query. Se a query não existir, `undefined` será retornado.

> Nota: Isso normalmente não é necessário para a maioria das aplicações, mas pode ser útil quando se precisa de mais informações sobre uma query em cenários raros (ex.: verificar o timestamp query.state.dataUpdatedAt para decidir se uma query é recente o suficiente para ser usada como valor inicial)

```tsx
const query = queryCache.find(queryKey);
```

**Opções**

- `filters?: QueryFilters`: [Query Filters](../framework/react/guides/filters#query-filters)

**Retorno**

- `Query`
  - A instância da query do cache

## `queryCache.findAll`

`findAll` é um método síncrono ainda mais avançado que pode ser usado para obter instâncias de query existentes do cache que correspondam parcialmente à query key. Se as queries não existirem, um array vazio será retornado.

> Nota: Isso normalmente não é necessário para a maioria das aplicações, mas pode ser útil quando se precisa de mais informações sobre uma query em cenários raros

```tsx
const queries = queryCache.findAll(queryKey);
```

**Opções**

- `queryKey?: QueryKey`: [Query Keys](../framework/react/guides/query-keys.md)
- `filters?: QueryFilters`: [Query Filters](../framework/react/guides/filters.md#query-filters)

**Retorno**

- `Query[]`
  - Instâncias de query do cache

## `queryCache.subscribe`

O método `subscribe` pode ser usado para se inscrever no query cache como um todo e ser informado sobre atualizações seguras/conhecidas no cache, como mudanças de estado das queries ou queries sendo atualizadas, adicionadas ou removidas

```tsx
const callback = (event) => {
  console.log(event.type, event.query);
};

const unsubscribe = queryCache.subscribe(callback);
```

**Opções**

- `callback: (event: QueryCacheNotifyEvent) => void`
  - Essa função será chamada com o query cache toda vez que ele for atualizado através de seus mecanismos de atualização rastreados (ex.: `query.setState`, `queryClient.removeQueries`, etc). Mutations fora do escopo no cache não são encorajadas e não dispararão callbacks de inscrição

**Retorno**

- `unsubscribe: Function => void`
  - Essa função cancelará a inscrição do callback no query cache.

## `queryCache.clear`

O método `clear` pode ser usado para limpar o cache completamente e começar do zero.

```tsx
queryCache.clear();
```

[//]: # "Materials"

## Leitura complementar

Para entender melhor como o QueryCache funciona internamente, dê uma olhada no [artigo Inside React Query do TkDodo](https://tkdodo.eu/blog/inside-react-query).

[//]: # "Materials"
