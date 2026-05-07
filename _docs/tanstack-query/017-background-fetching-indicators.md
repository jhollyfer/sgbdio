---
id: background-fetching-indicators
title: Background Fetching Indicators
---

O state `status === 'pending'` de uma query é suficiente para mostrar o state de carregamento inicial de uma query, mas às vezes você pode querer exibir um indicador adicional de que uma query está fazendo refetch em segundo plano. Para isso, as queries também fornecem um booleano `isFetching` que você pode usar para mostrar que ela está em um state de fetching, independentemente do valor da variável `status`:

[//]: # "Example"

```tsx
function Todos() {
  const {
    status,
    data: todos,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  return status === "pending" ? (
    <span>Loading...</span>
  ) : status === "error" ? (
    <span>Error: {error.message}</span>
  ) : (
    <>
      {isFetching ? <div>Refreshing...</div> : null}

      <div>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </div>
    </>
  );
}
```

[//]: # "Example"

## Exibindo o State de Carregamento Global de Fetching em Segundo Plano

Além dos states de carregamento individuais de cada query, se você quiser mostrar um indicador de carregamento global quando **qualquer** query estiver fazendo fetching (incluindo em segundo plano), você pode usar o hook `useIsFetching`:

[//]: # "Example2"

```tsx
import { useIsFetching } from "@tanstack/react-query";

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? (
    <div>Queries are fetching in the background...</div>
  ) : null;
}
```

[//]: # "Example2"
