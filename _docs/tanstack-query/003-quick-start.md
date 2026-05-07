---
id: quick-start
title: Quick Start
---

Este trecho de codigo ilustra brevemente os 3 conceitos principais do React Query:

- [Queries](./guides/queries.md)
- [Mutations](./guides/mutations.md)
- [Query Invalidation](./guides/query-invalidation.md)

[//]: # "Example"

Se voce esta procurando um exemplo totalmente funcional, de uma olhada no nosso [exemplo simples no StackBlitz](./examples/simple)

```tsx
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { getTodos, postTodo } from "../my-api";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({ queryKey: ["todos"], queryFn: getTodos });

  // Mutations
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div>
      <ul>
        {query.data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: "Do Laundry",
          });
        }}
      >
        Add Todo
      </button>
    </div>
  );
}

render(<App />, document.getElementById("root"));
```

[//]: # "Example"

Esses tres conceitos compreendem a maior parte da funcionalidade principal do React Query. As proximas secoes da documentacao vao cobrir cada um desses conceitos principais em grande detalhe.
