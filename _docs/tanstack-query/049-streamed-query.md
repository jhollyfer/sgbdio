---
id: streamedQuery
title: streamedQuery
---

`streamedQuery` é uma função auxiliar para criar uma função de query que transmite dados a partir de um [AsyncIterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator). Os dados serão um Array de todos os chunks recebidos. A query ficará em state `pending` até que o primeiro chunk de dados seja recebido, mas passará para `success` após isso. A query permanecerá com fetchStatus `fetching` até que o stream termine.

Para ver o `streamedQuery` em ação, dê uma olhada no nosso exemplo de chat no [diretório examples/react/chat no GitHub](https://github.com/TanStack/query/tree/main/examples/react/chat).

```tsx
import { experimental_streamedQuery as streamedQuery } from "@tanstack/react-query";

const query = queryOptions({
  queryKey: ["data"],
  queryFn: streamedQuery({
    streamFn: fetchDataInChunks,
  }),
});
```

> Nota: `streamedQuery` está atualmente marcado como `experimental` porque queremos coletar feedback da comunidade. Se você experimentou a API e tem feedback para nós, por favor compartilhe nesta [discussão no GitHub](https://github.com/TanStack/query/discussions/9065).

**Opções**

- `streamFn: (context: QueryFunctionContext) => Promise<AsyncIterable<TData>>`
  - **Obrigatório**
  - A função que retorna uma Promise de um AsyncIterable com dados para transmitir.
  - Recebe um [QueryFunctionContext](../framework/react/guides/query-functions.md#queryfunctioncontext)
- `refetchMode?: 'append' | 'reset' | 'replace'`
  - Opcional
  - Define como os refetches são tratados.
  - O padrão é `'reset'`
  - Quando definido como `'reset'`, a query apagará todos os dados e voltará para o state `pending`.
  - Quando definido como `'append'`, os dados serão adicionados aos dados existentes.
  - Quando definido como `'replace'`, todos os dados serão escritos no cache quando o stream terminar.
- `reducer?: (accumulator: TData, chunk: TQueryFnData) => TData`
  - Opcional
  - Reduz os chunks transmitidos (`TQueryFnData`) para o formato final dos dados (`TData`).
  - Padrão: adiciona cada chunk ao final do acumulador quando `TData` é um array.
  - Se `TData` não for um array, você deve fornecer um `reducer` personalizado.
- `initialValue?: TData = TQueryFnData`
  - Opcional
  - Define os dados iniciais a serem usados enquanto o primeiro chunk está sendo buscado, e também é retornado quando o stream não produz valores.
  - É obrigatório quando um `reducer` personalizado é fornecido.
  - O padrão é um array vazio.
