---
id: disabling-queries
title: Disabling/Pausing Queries
---

Se você quiser desabilitar uma query para que ela não seja executada automaticamente, pode usar a opção `enabled = false`. A opção enabled também aceita um callback que retorna um booleano.

Quando `enabled` é `false`:

- Se a query tem dados em cache, então a query será inicializada no state `status === 'success'` ou `isSuccess`.
- Se a query não tem dados em cache, então a query começará no state `status === 'pending'` e `fetchStatus === 'idle'`.
- A query não fará fetch automaticamente na montagem.
- A query não fará refetch automaticamente em segundo plano.
- A query ignorará chamadas de `invalidateQueries` e `refetchQueries` do query client que normalmente resultariam em refetch da query.
- `refetch` retornado pelo `useQuery` pode ser usado para disparar manualmente o fetch da query. No entanto, não funcionará com `skipToken`.

> Usuários de TypeScript podem preferir usar o [skipToken](#typesafe-disabling-of-queries-using-skiptoken) como alternativa a `enabled = false`.

[//]: # "Example"

```tsx
function Todos() {
  const { isLoading, isError, data, error, refetch, isFetching } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodoList,
    enabled: false,
  });

  return (
    <div>
      <button onClick={() => refetch()}>Fetch Todos</button>

      {data ? (
        <ul>
          {data.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>Not ready ...</span>
      )}

      <div>{isFetching ? "Fetching..." : null}</div>
    </div>
  );
}
```

[//]: # "Example"

Desabilitar permanentemente uma query faz com que você abra mão de muitos recursos excelentes que o TanStack Query tem a oferecer (como refetches em segundo plano), e também não é a maneira idiomática. Isso te leva da abordagem declarativa (definir dependências de quando sua query deve ser executada) para um modo imperativo (fazer fetch sempre que eu clicar aqui). Também não é possível passar parâmetros para `refetch`. Na maioria das vezes, tudo o que você quer é uma query lazy que adia o fetch inicial:

## Queries Lazy

A opção enabled pode ser usada não apenas para desabilitar permanentemente uma query, mas também para habilitá-la / desabilitá-la posteriormente. Um bom exemplo seria um formulário de filtro onde você só quer disparar a primeira requisição depois que o usuário inserir um valor de filtro:

[//]: # "Example2"

```tsx
function Todos() {
  const [filter, setFilter] = React.useState("");

  const { data } = useQuery({
    queryKey: ["todos", filter],
    queryFn: () => fetchTodos(filter),
    // ⬇️ disabled as long as the filter is empty
    enabled: !!filter,
  });

  return (
    <div>
      // 🚀 applying the filter will enable and execute the query
      <FiltersForm onApply={setFilter} />
      {data && <TodosTable data={data} />}
    </div>
  );
}
```

[//]: # "Example2"

### isLoading (Anteriormente: `isInitialLoading`)

Queries lazy estarão em `status: 'pending'` desde o início porque `pending` significa que ainda não há dados. Isso é tecnicamente verdade, porém, como não estamos fazendo fetching de dados no momento (pois a query não está _enabled_), isso também significa que você provavelmente não pode usar essa flag para mostrar um spinner de carregamento.

Se você está usando queries desabilitadas ou lazy, pode usar a flag `isLoading` em vez disso. É uma flag derivada que é calculada a partir de:

`isPending && isFetching`

então ela só será true se a query estiver fazendo fetching pela primeira vez.

## Desabilitando queries de forma segura com tipagem usando `skipToken`

Se você está usando TypeScript, pode usar o `skipToken` para desabilitar uma query. Isso é útil quando você quer desabilitar uma query com base em uma condição, mas ainda quer que a query tenha tipagem segura.

> **IMPORTANTE**: `refetch` do `useQuery` não funcionará com `skipToken`. Chamar `refetch()` em uma query que usa `skipToken` resultará em um erro `Missing queryFn` porque não há uma função de query válida para executar. Se você precisa disparar queries manualmente, considere usar `enabled: false` em vez disso, que permite que `refetch()` funcione corretamente. Fora essa limitação, `skipToken` funciona da mesma forma que `enabled: false`.

[//]: # "Example3"

```tsx
import { skipToken, useQuery } from "@tanstack/react-query";

function Todos() {
  const [filter, setFilter] = React.useState<string | undefined>();

  const { data } = useQuery({
    queryKey: ["todos", filter],
    // ⬇️ disabled as long as the filter is undefined or empty
    queryFn: filter ? () => fetchTodos(filter) : skipToken,
  });

  return (
    <div>
      // 🚀 applying the filter will enable and execute the query
      <FiltersForm onApply={setFilter} />
      {data && <TodosTable data={data} />}
    </div>
  );
}
```

[//]: # "Example3"
