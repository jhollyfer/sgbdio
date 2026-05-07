---
id: invalidations-from-mutations
title: Invalidations from Mutations
---

Invalidar queries é apenas metade da batalha. Saber **quando** invalidá-las é a outra metade. Normalmente, quando uma mutation no seu app é bem-sucedida, é MUITO provável que existam queries relacionadas na sua aplicação que precisam ser invalidadas e possivelmente re-buscadas para refletir as novas alterações da sua mutation.

Por exemplo, suponha que temos uma mutation para postar um novo todo:

[//]: # "Example"

```tsx
const mutation = useMutation({ mutationFn: postTodo });
```

[//]: # "Example"

Quando uma mutation `postTodo` bem-sucedida acontece, provavelmente queremos que todas as queries de `todos` sejam invalidadas e possivelmente re-buscadas para mostrar o novo item de todo. Para fazer isso, você pode usar as opções `onSuccess` do `useMutation` e a função `invalidateQueries` do `client`:

[//]: # "Example2"

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// When this mutation succeeds, invalidate any queries with the `todos` or `reminders` query key
const mutation = useMutation({
  mutationFn: addTodo,
  onSuccess: async () => {
    // If you're invalidating a single query
    await queryClient.invalidateQueries({ queryKey: ["todos"] });

    // If you're invalidating multiple queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["todos"] }),
      queryClient.invalidateQueries({ queryKey: ["reminders"] }),
    ]);
  },
});
```

[//]: # "Example2"

Retornar uma Promise no `onSuccess` garante que os dados sejam atualizados antes que a mutation esteja totalmente completa (ou seja, isPending é true até que o onSuccess seja cumprido)

[//]: # "Example2"

Você pode configurar suas invalidações para acontecerem usando qualquer um dos callbacks disponíveis no [hook `useMutation`](./mutations.md)

[//]: # "Materials"

## Leitura complementar

Para uma técnica de invalidação automática de Queries após Mutations, dê uma olhada no [artigo do TkDodo sobre Automatic Query Invalidation after Mutations](https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations).

[//]: # "Materials"
