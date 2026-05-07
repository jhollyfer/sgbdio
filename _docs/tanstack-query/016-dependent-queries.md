---
id: dependent-queries
title: Dependent Queries
---

## Query dependente com useQuery

Queries dependentes (ou seriais) dependem de queries anteriores serem finalizadas antes de poderem ser executadas. Para conseguir isso, basta usar a opção `enabled` para informar a uma query quando ela está pronta para ser executada:

[//]: # "Example"

```tsx
// Get the user
const { data: user } = useQuery({
  queryKey: ["user", email],
  queryFn: getUserByEmail,
});

const userId = user?.id;

// Then get the user's projects
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ["projects", userId],
  queryFn: getProjectsByUser,
  // The query will not execute until the userId exists
  enabled: !!userId,
});
```

[//]: # "Example"

A query `projects` começará em:

```tsx
status: "pending";
isPending: true;
fetchStatus: "idle";
```

Assim que o `user` estiver disponível, a query `projects` será `enabled` e então fará a transição para:

```tsx
status: "pending";
isPending: true;
fetchStatus: "fetching";
```

Uma vez que tivermos os projetos, ela irá para:

```tsx
status: "success";
isPending: false;
fetchStatus: "idle";
```

## Query dependente com useQueries

Queries paralelas dinâmicas - `useQueries` também pode depender de uma query anterior, veja como conseguir isso:

[//]: # "Example2"

```tsx
// Get the users ids
const { data: userIds } = useQuery({
  queryKey: ["users"],
  queryFn: getUsersData,
  select: (users) => users.map((user) => user.id),
});

// Then get the users messages
const usersMessages = useQueries({
  queries: userIds
    ? userIds.map((id) => {
        return {
          queryKey: ["messages", id],
          queryFn: () => getMessagesByUsers(id),
        };
      })
    : [], // if userIds is undefined, an empty array will be returned
});
```

[//]: # "Example2"

**Observe** que `useQueries` retorna um **array de resultados de query**

## Uma nota sobre desempenho

Queries dependentes por definição constituem uma forma de [request waterfall](./request-waterfalls.md), o que prejudica o desempenho. Se imaginarmos que ambas as queries levam a mesma quantidade de tempo, executá-las em série em vez de em paralelo sempre leva o dobro do tempo, o que é especialmente prejudicial quando acontece em um cliente com alta latência. Se possível, é sempre melhor reestruturar as APIs do backend para que ambas as queries possam ser feitas em paralelo, embora isso nem sempre seja praticamente viável.

No exemplo acima, em vez de primeiro fazer fetch de `getUserByEmail` para poder chamar `getProjectsByUser`, introduzir uma nova query `getProjectsByUserEmail` eliminaria o waterfall.
