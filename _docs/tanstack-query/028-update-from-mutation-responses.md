---
id: updates-from-mutation-responses
title: Updates from Mutation Responses
---

Ao lidar com mutations que **atualizam** objetos no servidor, é comum que o novo objeto seja automaticamente retornado na resposta da mutation. Em vez de fazer refetch de qualquer query para aquele item e desperdiçar uma chamada de rede com dados que já temos, podemos aproveitar o objeto retornado pela função da mutation e atualizar a query existente com os novos dados imediatamente usando o [método `setQueryData` do Query Client](../../../reference/QueryClient.md#queryclientsetquerydata):

[//]: # "Example"

```tsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: editTodo,
  onSuccess: (data) => {
    queryClient.setQueryData(["todo", { id: 5 }], data);
  },
});

mutation.mutate({
  id: 5,
  name: "Do the laundry",
});

// The query below will be updated with the response from the
// successful mutation
const { status, data, error } = useQuery({
  queryKey: ["todo", { id: 5 }],
  queryFn: fetchTodoById,
});
```

[//]: # "Example"

Você pode querer vincular a lógica do `onSuccess` em uma mutation reutilizável. Para isso, você pode criar um hook customizado assim:

[//]: # "Example2"

```tsx
const useMutateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTodo,
    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["todo", { id: variables.id }], data);
    },
  });
};
```

[//]: # "Example2"

## Imutabilidade

Atualizações via `setQueryData` devem ser realizadas de forma _imutável_. **NÃO** tente escrever diretamente no cache mutando dados (que você obteve do cache) no local. Pode funcionar inicialmente, mas pode levar a bugs sutis ao longo do caminho.

[//]: # "Example3"

```tsx
queryClient.setQueryData(["posts", { id }], (oldData) => {
  if (oldData) {
    // ❌ do not try this
    oldData.title = "my new post title";
  }
  return oldData;
});

queryClient.setQueryData(
  ["posts", { id }],
  // ✅ this is the way
  (oldData) =>
    oldData
      ? {
          ...oldData,
          title: "my new post title",
        }
      : oldData,
);
```

[//]: # "Example3"
