---
id: optimistic-updates
title: Optimistic Updates
---

O React Query oferece duas maneiras de atualizar otimisticamente sua UI antes que uma mutation tenha sido concluída. Você pode usar a opção `onMutate` para atualizar o cache diretamente, ou aproveitar as `variables` retornadas para atualizar sua UI a partir do resultado do `useMutation`.

## Via UI

Esta é a variante mais simples, pois não interage com o cache diretamente.

[//]: # "ExampleUI1"

```tsx
const addTodoMutation = useMutation({
  mutationFn: (newTodo: string) => axios.post("/api/data", { text: newTodo }),
  // make sure to _return_ the Promise from the query invalidation
  // so that the mutation stays in `pending` state until the refetch is finished
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
});

const { isPending, submittedAt, variables, mutate, isError } = addTodoMutation;
```

[//]: # "ExampleUI1"

Você terá acesso a `addTodoMutation.variables`, que contém o todo adicionado. Na sua lista da UI, onde a query é renderizada, você pode adicionar outro item à lista enquanto a mutation estiver com `isPending`:

[//]: # "ExampleUI2"

```tsx
<ul>
  {todoQuery.items.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
  {isPending && <li style={{ opacity: 0.5 }}>{variables}</li>}
</ul>
```

[//]: # "ExampleUI2"

Estamos renderizando um item temporário com uma `opacity` diferente enquanto a mutation estiver pendente. Uma vez concluída, o item automaticamente deixará de ser renderizado. Supondo que o refetch tenha sido bem-sucedido, devemos ver o item como um "item normal" na nossa lista.

Se a mutation falhar, o item também desaparecerá. Mas podemos continuar mostrando-o, se quisermos, verificando o state `isError` da mutation. As `variables` _não_ são limpas quando a mutation falha, então ainda podemos acessá-las e talvez até mostrar um botão de retry:

[//]: # "ExampleUI3"

```tsx
{
  isError && (
    <li style={{ color: "red" }}>
      {variables}
      <button onClick={() => mutate(variables)}>Retry</button>
    </li>
  );
}
```

[//]: # "ExampleUI3"

### Se a mutation e a query não estão no mesmo component

Essa abordagem funciona muito bem se a mutation e a query estão no mesmo component. No entanto, você também pode acessar todas as mutations em outros components através do hook dedicado `useMutationState`. Ele funciona melhor combinado com uma `mutationKey`:

[//]: # "ExampleUI4"

```tsx
// somewhere in your app
const { mutate } = useMutation({
  mutationFn: (newTodo: string) => axios.post("/api/data", { text: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  mutationKey: ["addTodo"],
});

// access variables somewhere else
const variables = useMutationState<string>({
  filters: { mutationKey: ["addTodo"], status: "pending" },
  select: (mutation) => mutation.state.variables,
});
```

[//]: # "ExampleUI4"

`variables` será um `Array`, porque pode haver múltiplas mutations rodando ao mesmo tempo. Se precisarmos de uma chave única para os itens, também podemos selecionar `mutation.state.submittedAt`. Isso torna a exibição de atualizações otimísticas concorrentes muito fácil.

## Via cache

Quando você atualiza otimisticamente o state antes de executar uma mutation, há uma chance de que a mutation falhe. Na maioria desses casos de falha, você pode simplesmente disparar um refetch para suas queries otimísticas para revertê-las ao state real do servidor. Em algumas circunstâncias, porém, o refetch pode não funcionar corretamente e o erro da mutation pode representar algum tipo de problema no servidor que impossibilite o refetch. Nesse caso, você pode optar por reverter (rollback) sua atualização.

Para fazer isso, o handler `onMutate` do `useMutation` permite que você retorne um valor que será passado posteriormente para os handlers `onError` e `onSettled` como último argumento. Na maioria dos casos, é mais útil retornar uma função de rollback.

### Atualizando uma lista de todos ao adicionar um novo todo

[//]: # "Example"

```tsx
const queryClient = useQueryClient();

useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (newTodo, context) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await context.client.cancelQueries({ queryKey: ["todos"] });

    // Snapshot the previous value
    const previousTodos = context.client.getQueryData(["todos"]);

    // Optimistically update to the new value
    context.client.setQueryData(["todos"], (old) => [...old, newTodo]);

    // Return a result with the snapshotted value
    return { previousTodos };
  },
  // If the mutation fails,
  // use the result returned from onMutate to roll back
  onError: (err, newTodo, onMutateResult, context) => {
    context.client.setQueryData(["todos"], onMutateResult.previousTodos);
  },
  // Always refetch after error or success:
  onSettled: (data, error, variables, onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ["todos"] }),
});
```

[//]: # "Example"

### Atualizando um único todo

[//]: # "Example2"

```tsx
useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (newTodo, context) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await context.client.cancelQueries({ queryKey: ["todos", newTodo.id] });

    // Snapshot the previous value
    const previousTodo = context.client.getQueryData(["todos", newTodo.id]);

    // Optimistically update to the new value
    context.client.setQueryData(["todos", newTodo.id], newTodo);

    // Return a result with the previous and new todo
    return { previousTodo, newTodo };
  },
  // If the mutation fails, use the result we returned above
  onError: (err, newTodo, onMutateResult, context) => {
    context.client.setQueryData(
      ["todos", onMutateResult.newTodo.id],
      onMutateResult.previousTodo,
    );
  },
  // Always refetch after error or success:
  onSettled: (newTodo, error, variables, onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ["todos", newTodo.id] }),
});
```

[//]: # "Example2"

Você também pode usar a função `onSettled` no lugar dos handlers separados `onError` e `onSuccess`, se preferir:

[//]: # "Example3"

```tsx
useMutation({
  mutationFn: updateTodo,
  // ...
  onSettled: async (newTodo, error, variables, onMutateResult, context) => {
    if (error) {
      // do something
    }
  },
});
```

[//]: # "Example3"

## Quando usar o quê

Se você tem apenas um lugar onde o resultado otimístico deve ser mostrado, usar `variables` e atualizar a UI diretamente é a abordagem que requer menos código e geralmente é mais fácil de entender. Por exemplo, você não precisa lidar com rollbacks de forma alguma.

No entanto, se você tem múltiplos lugares na tela que precisariam saber sobre a atualização, manipular o cache diretamente cuidará disso automaticamente para você.

[//]: # "Materials"

## Leitura complementar

Dê uma olhada no guia do TkDodo sobre [Concurrent Optimistic Updates](https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query).

[//]: # "Materials"
