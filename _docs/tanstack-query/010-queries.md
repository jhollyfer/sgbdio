---
id: queries
title: Queries
---

## Fundamentos de Queries

Uma query é uma dependência declarativa de uma fonte assíncrona de dados que está vinculada a uma **chave única**. Uma query pode ser usada com qualquer método baseado em Promise (incluindo métodos GET e POST) para buscar dados de um servidor. Se o seu método modifica dados no servidor, recomendamos usar [Mutations](./mutations.md) em vez disso.

Para se inscrever em uma query nos seus components ou hooks customizados, chame o hook `useQuery` com pelo menos:

- Uma **chave única para a query**
- Uma função que retorna uma promise que:
  - Resolve os dados, ou
  - Lança um erro

[//]: # "Example"

```tsx
import { useQuery } from "@tanstack/react-query";

function App() {
  const info = useQuery({ queryKey: ["todos"], queryFn: fetchTodoList });
}
```

[//]: # "Example"

A **chave única** que você fornece é usada internamente para refetching, caching e compartilhamento das suas queries por toda a sua aplicação.

O resultado da query retornado pelo `useQuery` contém todas as informações sobre a query que você vai precisar para fazer o template e qualquer outro uso dos dados:

[//]: # "Example2"

```tsx
const result = useQuery({ queryKey: ["todos"], queryFn: fetchTodoList });
```

[//]: # "Example2"

O objeto `result` contém alguns states muito importantes que você precisa conhecer para ser produtivo. Uma query pode estar em apenas um dos seguintes states em qualquer momento:

- `isPending` ou `status === 'pending'` - A query ainda não tem dados
- `isError` ou `status === 'error'` - A query encontrou um erro
- `isSuccess` ou `status === 'success'` - A query foi bem-sucedida e os dados estão disponíveis

Além desses states primários, mais informações estão disponíveis dependendo do state da query:

- `error` - Se a query está em um state `isError`, o erro está disponível através da propriedade `error`.
- `data` - Se a query está em um state `isSuccess`, os dados estão disponíveis através da propriedade `data`.
- `isFetching` - Em qualquer state, se a query está fazendo fetching a qualquer momento (incluindo refetching em segundo plano) `isFetching` será `true`.

Para a **maioria** das queries, geralmente é suficiente verificar o state `isPending`, depois o state `isError` e, finalmente, assumir que os dados estão disponíveis e renderizar o state de sucesso:

[//]: # "Example3"

```tsx
function Todos() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodoList,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

[//]: # "Example3"

Se booleanos não são a sua praia, você sempre pode usar o state `status` também:

[//]: # "Example4"

```tsx
function Todos() {
  const { status, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodoList,
  });

  if (status === "pending") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  // also status === 'success', but "else" logic works, too
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

[//]: # "Example4"

O TypeScript também vai fazer o narrowing do tipo de `data` corretamente se você verificar `pending` e `error` antes de acessá-lo.

### FetchStatus

Além do campo `status`, você também terá uma propriedade adicional `fetchStatus` com as seguintes opções:

- `fetchStatus === 'fetching'` - A query está fazendo fetching no momento.
- `fetchStatus === 'paused'` - A query queria fazer fetch, mas está pausada. Leia mais sobre isso no guia [Network Mode](./network-mode.md).
- `fetchStatus === 'idle'` - A query não está fazendo nada no momento.

### Por que dois states diferentes?

Refetches em segundo plano e a lógica de stale-while-revalidate tornam todas as combinações de `status` e `fetchStatus` possíveis. Por exemplo:

- uma query com status `success` geralmente estará no fetchStatus `idle`, mas também poderia estar em `fetching` se um refetch em segundo plano estiver acontecendo.
- uma query que é montada e não tem dados geralmente estará no status `pending` e fetchStatus `fetching`, mas também poderia estar `paused` se não houver conexão de rede.

Então tenha em mente que uma query pode estar no state `pending` sem estar realmente fazendo fetching de dados. Como regra geral:

- O `status` dá informações sobre os `data`: Temos algum dado ou não?
- O `fetchStatus` dá informações sobre a `queryFn`: Ela está executando ou não?

[//]: # "Materials"

## Leitura Complementar

Para uma forma alternativa de realizar verificações de status, dê uma olhada [neste artigo do TkDodo](https://tkdodo.eu/blog/status-checks-in-react-query).

[//]: # "Materials"
