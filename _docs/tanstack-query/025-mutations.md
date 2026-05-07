---
id: mutations
title: Mutations
---

Diferentemente de queries, mutations são tipicamente usadas para criar/atualizar/deletar dados ou executar efeitos colaterais no servidor. Para esse propósito, o TanStack Query exporta o hook `useMutation`.

Aqui está um exemplo de uma mutation que adiciona um novo todo ao servidor:

[//]: # "Example"

```tsx
function App() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post("/todos", newTodo);
    },
  });

  return (
    <div>
      {mutation.isPending ? (
        "Adding todo..."
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: "Do Laundry" });
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  );
}
```

[//]: # "Example"

Uma mutation pode estar em apenas um dos seguintes estados em qualquer momento:

- `isIdle` ou `status === 'idle'` - A mutation está atualmente ociosa ou em um state fresh/reset
- `isPending` ou `status === 'pending'` - A mutation está sendo executada no momento
- `isError` ou `status === 'error'` - A mutation encontrou um erro
- `isSuccess` ou `status === 'success'` - A mutation foi bem-sucedida e os dados da mutation estão disponíveis

Além desses estados primários, mais informações estão disponíveis dependendo do state da mutation:

- `error` - Se a mutation estiver em um state `error`, o erro estará disponível pela propriedade `error`.
- `data` - Se a mutation estiver em um state `success`, os dados estarão disponíveis pela propriedade `data`.

No exemplo acima, você também viu que pode passar variáveis para a função da mutation chamando a função `mutate` com **uma única variável ou objeto**.

Mesmo apenas com variáveis, mutations não são tão especiais assim, mas quando usadas com a opção `onSuccess`, o [método `invalidateQueries` do Query Client](../../../reference/QueryClient.md#queryclientinvalidatequeries) e o [método `setQueryData` do Query Client](../../../reference/QueryClient.md#queryclientsetquerydata), mutations se tornam uma ferramenta muito poderosa.

[//]: # "Info1"

> IMPORTANTE: A função `mutate` é uma função assíncrona, o que significa que você não pode usá-la diretamente em um callback de evento no **React 16 e anteriores**. Se você precisar acessar o evento no `onSubmit`, você precisa envolver o `mutate` em outra função. Isso se deve ao [React event pooling](https://reactjs.org/docs/legacy-event-pooling.html).

[//]: # "Info1"
[//]: # "Example2"

```tsx
// This will not work in React 16 and earlier
const CreateTodo = () => {
  const mutation = useMutation({
    mutationFn: (event) => {
      event.preventDefault();
      return fetch("/api", new FormData(event.target));
    },
  });

  return <form onSubmit={mutation.mutate}>...</form>;
};

// This will work
const CreateTodo = () => {
  const mutation = useMutation({
    mutationFn: (formData) => {
      return fetch("/api", formData);
    },
  });
  const onSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(new FormData(event.target));
  };

  return <form onSubmit={onSubmit}>...</form>;
};
```

[//]: # "Example2"

## Resetando o State da Mutation

Às vezes você precisa limpar o `error` ou `data` de uma requisição de mutation. Para fazer isso, você pode usar a função `reset`:

[//]: # "Example3"

```tsx
const CreateTodo = () => {
  const [title, setTitle] = useState("");
  const mutation = useMutation({ mutationFn: createTodo });

  const onCreateTodo = (e) => {
    e.preventDefault();
    mutation.mutate({ title });
  };

  return (
    <form onSubmit={onCreateTodo}>
      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button type="submit">Create Todo</button>
    </form>
  );
};
```

[//]: # "Example3"

## Efeitos Colaterais de Mutations

O `useMutation` vem com algumas opções auxiliares que permitem efeitos colaterais rápidos e fáceis em qualquer estágio durante o ciclo de vida da mutation. Elas são úteis tanto para [invalidar e fazer refetch de queries após mutations](./invalidations-from-mutations.md) quanto para [atualizações otimistas](./optimistic-updates.md)

[//]: # "Example4"

```tsx
useMutation({
  mutationFn: addTodo,
  onMutate: (variables, context) => {
    // A mutation is about to happen!

    // Optionally return a result containing data to use when for example rolling back
    return { id: 1 };
  },
  onError: (error, variables, onMutateResult, context) => {
    // An error happened!
    console.log(`rolling back optimistic update with id ${onMutateResult.id}`);
  },
  onSuccess: (data, variables, onMutateResult, context) => {
    // Boom baby!
  },
  onSettled: (data, error, variables, onMutateResult, context) => {
    // Error or success... doesn't matter!
  },
});
```

[//]: # "Example4"

Quando uma promise é retornada em qualquer uma das funções de callback, ela será aguardada antes do próximo callback ser chamado:

[//]: # "Example5"

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: async () => {
    console.log("I'm first!");
  },
  onSettled: async () => {
    console.log("I'm second!");
  },
});
```

[//]: # "Example5"

Você pode querer **disparar callbacks adicionais** além dos definidos no `useMutation` ao chamar `mutate`. Isso pode ser usado para disparar efeitos colaterais específicos do component. Para fazer isso, você pode fornecer qualquer uma das mesmas opções de callback para a função `mutate` após a variável da mutation. As opções suportadas incluem: `onSuccess`, `onError` e `onSettled`. Tenha em mente que esses callbacks adicionais não serão executados se o component for desmontado _antes_ da mutation finalizar.

[//]: # "Example6"

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: (data, variables, onMutateResult, context) => {
    // I will fire first
  },
  onError: (error, variables, onMutateResult, context) => {
    // I will fire first
  },
  onSettled: (data, error, variables, onMutateResult, context) => {
    // I will fire first
  },
});

mutate(todo, {
  onSuccess: (data, variables, onMutateResult, context) => {
    // I will fire second!
  },
  onError: (error, variables, onMutateResult, context) => {
    // I will fire second!
  },
  onSettled: (data, error, variables, onMutateResult, context) => {
    // I will fire second!
  },
});
```

[//]: # "Example6"

### Mutations consecutivas

Existe uma diferença sutil no tratamento dos callbacks `onSuccess`, `onError` e `onSettled` quando se trata de mutations consecutivas. Quando passados para a função `mutate`, eles serão disparados apenas _uma vez_ e apenas se o component ainda estiver montado. Isso se deve ao fato de que o observer da mutation é removido e reinscrito toda vez que a função `mutate` é chamada. Por outro lado, os handlers do `useMutation` são executados para cada chamada de `mutate`.

> Esteja ciente de que, muito provavelmente, a `mutationFn` passada para o `useMutation` é assíncrona. Nesse caso, a ordem em que as mutations são concluídas pode diferir da ordem das chamadas da função `mutate`.

[//]: # "Example7"

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: (data, variables, onMutateResult, context) => {
    // Will be called 3 times
  },
});

const todos = ["Todo 1", "Todo 2", "Todo 3"];
todos.forEach((todo) => {
  mutate(todo, {
    onSuccess: (data, variables, onMutateResult, context) => {
      // Will execute only once, for the last mutation (Todo 3),
      // regardless which mutation resolves first
    },
  });
});
```

[//]: # "Example7"

## Promises

Use `mutateAsync` em vez de `mutate` para obter uma promise que será resolvida em caso de sucesso ou lançará um erro em caso de falha. Isso pode ser usado, por exemplo, para compor efeitos colaterais.

[//]: # "Example8"

```tsx
const mutation = useMutation({ mutationFn: addTodo });

try {
  const todo = await mutation.mutateAsync(todo);
  console.log(todo);
} catch (error) {
  console.error(error);
} finally {
  console.log("done");
}
```

[//]: # "Example8"

## Retry

Por padrão, o TanStack Query não fará retry de uma mutation em caso de erro, mas é possível com a opção `retry`:

[//]: # "Example9"

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  retry: 3,
});
```

[//]: # "Example9"

Se mutations falharem porque o dispositivo está offline, elas serão tentadas novamente na mesma ordem quando o dispositivo se reconectar.

## Persistir mutations

Mutations podem ser persistidas em armazenamento se necessário e retomadas em um momento posterior. Isso pode ser feito com as funções de hydration:

[//]: # "Example10"

```tsx
const queryClient = new QueryClient();

// Define the "addTodo" mutation
queryClient.setMutationDefaults(["addTodo"], {
  mutationFn: addTodo,
  onMutate: async (variables, context) => {
    // Cancel current queries for the todos list
    await context.client.cancelQueries({ queryKey: ["todos"] });

    // Create optimistic todo
    const optimisticTodo = { id: uuid(), title: variables.title };

    // Add optimistic todo to todos list
    context.client.setQueryData(["todos"], (old) => [...old, optimisticTodo]);

    // Return a result with the optimistic todo
    return { optimisticTodo };
  },
  onSuccess: (result, variables, onMutateResult, context) => {
    // Replace optimistic todo in the todos list with the result
    context.client.setQueryData(["todos"], (old) =>
      old.map((todo) =>
        todo.id === onMutateResult.optimisticTodo.id ? result : todo,
      ),
    );
  },
  onError: (error, variables, onMutateResult, context) => {
    // Remove optimistic todo from the todos list
    context.client.setQueryData(["todos"], (old) =>
      old.filter((todo) => todo.id !== onMutateResult.optimisticTodo.id),
    );
  },
  retry: 3,
});

// Start mutation in some component:
const mutation = useMutation({ mutationKey: ["addTodo"] });
mutation.mutate({ title: "title" });

// If the mutation has been paused because the device is for example offline,
// Then the paused mutation can be dehydrated when the application quits:
const state = dehydrate(queryClient);

// The mutation can then be hydrated again when the application is started:
hydrate(queryClient, state);

// Resume the paused mutations:
queryClient.resumePausedMutations();
```

[//]: # "Example10"

### Persistindo mutations offline

Se você persistir mutations offline com o [plugin persistQueryClient](../plugins/persistQueryClient.md), as mutations não poderão ser retomadas quando a página for recarregada, a menos que você forneça uma função de mutation padrão.

Essa é uma limitação técnica. Ao persistir em um armazenamento externo, apenas o state das mutations é persistido, pois funções não podem ser serializadas. Após a hydration, o component que dispara a mutation pode não estar montado, então chamar `resumePausedMutations` pode gerar um erro: `No mutationFn found`.

[//]: # "Example11"

```tsx
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// we need a default mutation function so that paused mutations can resume after a page reload
queryClient.setMutationDefaults(["todos"], {
  mutationFn: ({ id, data }) => {
    return api.updateTodo(id, data);
  },
});

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations();
      }}
    >
      <RestOfTheApp />
    </PersistQueryClientProvider>
  );
}
```

[//]: # "Example11"

Nós também temos um extenso [exemplo offline](../examples/offline) que cobre tanto queries quanto mutations.

## Escopos de Mutation

Por padrão, todas as mutations são executadas em paralelo - mesmo se você invocar `.mutate()` da mesma mutation múltiplas vezes. Mutations podem receber um `scope` com um `id` para evitar isso. Todas as mutations com o mesmo `scope.id` serão executadas em série, o que significa que quando disparadas, elas iniciarão com state `isPaused: true` se já houver uma mutation para aquele escopo em andamento. Elas serão colocadas em uma fila e serão retomadas automaticamente quando chegar sua vez na fila.

[//]: # "ExampleScopes"

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  scope: {
    id: "todo",
  },
});
```

[//]: # "ExampleScopes"
[//]: # "Materials"

## Leitura complementar

Para mais informações sobre mutations, dê uma olhada no [artigo do TkDodo sobre Mastering Mutations in React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query).

[//]: # "Materials"
