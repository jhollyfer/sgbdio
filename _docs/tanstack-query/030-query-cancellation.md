---
id: query-cancellation
title: Query Cancellation
---

O TanStack Query fornece a cada função de query uma [instância de `AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal). Quando uma query se torna desatualizada ou inativa, esse `signal` será abortado. Isso significa que todas as queries são canceláveis, e você pode responder ao cancelamento dentro da sua função de query, se desejar. A melhor parte disso é que permite que você continue usando a sintaxe normal de async/await enquanto obtém todos os benefícios do cancelamento automático.

A API `AbortController` está disponível na [maioria dos ambientes de execução](https://developer.mozilla.org/docs/Web/API/AbortController#browser_compatibility), mas se seu ambiente de execução não a suportar, você precisará fornecer um polyfill. Existem [vários disponíveis](https://www.npmjs.com/search?q=abortcontroller%20polyfill).

## Comportamento padrão

Por padrão, queries que são desmontadas ou se tornam não utilizadas antes que suas promises sejam resolvidas _não_ são canceladas. Isso significa que, após a promise ser resolvida, os dados resultantes estarão disponíveis no cache. Isso é útil se você iniciou o recebimento de uma query, mas desmontou o component antes que ela terminasse. Se você montar o component novamente e a query ainda não tiver passado por garbage collection, os dados estarão disponíveis.

No entanto, se você consumir o `AbortSignal`, a Promise será cancelada (por exemplo, abortando o fetch) e, portanto, a Query também deve ser cancelada. Cancelar a query fará com que seu state seja _revertido_ ao state anterior.

## Usando `fetch`

[//]: # "Example"

```tsx
const query = useQuery({
  queryKey: ["todos"],
  queryFn: async ({ signal }) => {
    const todosResponse = await fetch("/todos", {
      // Pass the signal to one fetch
      signal,
    });
    const todos = await todosResponse.json();

    const todoDetails = todos.map(async ({ details }) => {
      const response = await fetch(details, {
        // Or pass it to several
        signal,
      });
      return response.json();
    });

    return Promise.all(todoDetails);
  },
});
```

[//]: # "Example"

## Usando `axios` [v0.22.0+](https://github.com/axios/axios/releases/tag/v0.22.0)

[//]: # "Example2"

```tsx
import axios from "axios";

const query = useQuery({
  queryKey: ["todos"],
  queryFn: ({ signal }) =>
    axios.get("/todos", {
      // Pass the signal to `axios`
      signal,
    }),
});
```

[//]: # "Example2"

### Usando `axios` com versão inferior a v0.22.0

[//]: # "Example3"

```tsx
import axios from "axios";

const query = useQuery({
  queryKey: ["todos"],
  queryFn: ({ signal }) => {
    // Create a new CancelToken source for this request
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const promise = axios.get("/todos", {
      // Pass the source token to your request
      cancelToken: source.token,
    });

    // Cancel the request if TanStack Query signals to abort
    signal?.addEventListener("abort", () => {
      source.cancel("Query was cancelled by TanStack Query");
    });

    return promise;
  },
});
```

[//]: # "Example3"

## Usando `XMLHttpRequest`

[//]: # "Example4"

```tsx
const query = useQuery({
  queryKey: ["todos"],
  queryFn: ({ signal }) => {
    return new Promise((resolve, reject) => {
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", () => {
        resolve(JSON.parse(oReq.responseText));
      });
      signal?.addEventListener("abort", () => {
        oReq.abort();
        reject();
      });
      oReq.open("GET", "/todos");
      oReq.send();
    });
  },
});
```

[//]: # "Example4"

## Usando `graphql-request`

Um `AbortSignal` pode ser definido no método `request` do client.

[//]: # "Example5"

```tsx
const client = new GraphQLClient(endpoint);

const query = useQuery({
  queryKey: ["todos"],
  queryFn: ({ signal }) => {
    client.request({ document: query, signal });
  },
});
```

[//]: # "Example5"

## Usando `graphql-request` com versão inferior a v4.0.0

Um `AbortSignal` pode ser definido no construtor do `GraphQLClient`.

[//]: # "Example6"

```tsx
const query = useQuery({
  queryKey: ["todos"],
  queryFn: ({ signal }) => {
    const client = new GraphQLClient(endpoint, {
      signal,
    });
    return client.request(query, variables);
  },
});
```

[//]: # "Example6"

## Cancelamento manual

Você pode querer cancelar uma query manualmente. Por exemplo, se a requisição demora muito para terminar, você pode permitir que o usuário clique em um botão de cancelar para interromper a requisição. Para fazer isso, basta chamar `queryClient.cancelQueries({ queryKey })`, que cancelará a query e a reverterá ao state anterior. Se você consumiu o `signal` passado para a função de query, o TanStack Query também cancelará a Promise.

[//]: # "Example7"

```tsx
const query = useQuery({
  queryKey: ["todos"],
  queryFn: async ({ signal }) => {
    const resp = await fetch("/todos", { signal });
    return resp.json();
  },
});

const queryClient = useQueryClient();

return (
  <button
    onClick={(e) => {
      e.preventDefault();
      queryClient.cancelQueries({ queryKey: ["todos"] });
    }}
  >
    Cancel
  </button>
);
```

[//]: # "Example7"

## `Cancel Options`

As opções de cancelamento são usadas para controlar o comportamento das operações de cancelamento de queries.

```tsx
// Cancel specific queries silently
await queryClient.cancelQueries({ queryKey: ["posts"] }, { silent: true });
```

Um objeto de opções de cancelamento suporta as seguintes propriedades:

- `silent?: boolean`
  - Quando definido como `true`, suprime a propagação de `CancelledError` para observers (por exemplo, callbacks `onError`) e notificações relacionadas, e retorna a promise de retry em vez de rejeitá-la.
  - O padrão é `false`
- `revert?: boolean`
  - Quando definido como `true`, restaura o state da query (dados e status) de imediatamente antes do fetch em andamento, define `fetchStatus` de volta para `idle`, e só lança exceção se não havia dados anteriores.
  - O padrão é `true`

## Limitações

O cancelamento não funciona quando se utiliza hooks com `Suspense`: `useSuspenseQuery`, `useSuspenseQueries` e `useSuspenseInfiniteQuery`.
