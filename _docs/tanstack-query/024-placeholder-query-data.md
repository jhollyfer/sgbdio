---
id: placeholder-query-data
title: Placeholder Query Data
---

## O que são dados placeholder?

Dados placeholder permitem que uma query se comporte como se já tivesse dados, similar à opção `initialData`, mas **os dados não são persistidos no cache**. Isso é útil para situações em que você tem dados parciais (ou fictícios) suficientes para renderizar a query com sucesso enquanto os dados reais são buscados em background.

> Exemplo: Uma query individual de post de blog poderia puxar dados de "preview" de uma lista pai de posts de blog que inclui apenas o título e um pequeno trecho do corpo do post. Você não gostaria de persistir esses dados parciais no resultado da query individual, mas é útil para mostrar o layout do conteúdo o mais rápido possível enquanto a query real termina de buscar o objeto completo.

Existem algumas maneiras de fornecer dados placeholder para uma query no cache antes de você precisar deles:

- Declarativamente:
  - Fornecer `placeholderData` a uma query para pré-popular seu cache se estiver vazio
- Imperativamente:
  - [Prefetch ou fetch dos dados usando `queryClient` e a opção `placeholderData`](./prefetching.md)

Quando usamos `placeholderData`, nossa Query não estará em um state `pending` - ela começará em state `success`, porque temos `data` para exibir - mesmo que esses dados sejam apenas dados "placeholder". Para distingui-los dos dados "reais", também teremos a flag `isPlaceholderData` definida como `true` no resultado da Query.

## Placeholder Data como Valor

[//]: # "ExampleValue"

```tsx
function Todos() {
  const result = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/todos"),
    placeholderData: placeholderTodos,
  });
}
```

[//]: # "ExampleValue"
[//]: # "Memoization"

### Memoização de Placeholder Data

Se o processo para acessar os dados placeholder de uma query for intensivo ou simplesmente não for algo que você queira realizar a cada render, você pode memoizar o valor:

```tsx
function Todos() {
  const placeholderData = useMemo(() => generateFakeTodos(), []);
  const result = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/todos"),
    placeholderData,
  });
}
```

[//]: # "Memoization"

## Placeholder Data como Função

`placeholderData` também pode ser uma função, onde você tem acesso aos dados e às informações de Query meta de uma Query bem-sucedida "anterior". Isso é útil para situações em que você deseja usar os dados de uma query como dados placeholder para outra query. Quando a QueryKey muda, por exemplo de `['todos', 1]` para `['todos', 2]`, podemos continuar exibindo dados "antigos" em vez de ter que mostrar um spinner de carregamento enquanto os dados estão em _transição_ de uma Query para a próxima. Para mais informações, veja [Queries Paginadas](./paginated-queries.md).

[//]: # "ExampleFunction"

```tsx
const result = useQuery({
  queryKey: ["todos", id],
  queryFn: () => fetch(`/todos/${id}`),
  placeholderData: (previousData, previousQuery) => previousData,
});
```

[//]: # "ExampleFunction"

### Placeholder Data do Cache

Em algumas circunstâncias, você pode conseguir fornecer os dados placeholder para uma query a partir do resultado em cache de outra. Um bom exemplo disso seria buscar nos dados em cache de uma query de lista de posts de blog uma versão de preview do post, e então usar isso como dados placeholder para a query individual desse post:

[//]: # "ExampleCache"

```tsx
function BlogPost({ blogPostId }) {
  const queryClient = useQueryClient();
  const result = useQuery({
    queryKey: ["blogPost", blogPostId],
    queryFn: () => fetch(`/blogPosts/${blogPostId}`),
    placeholderData: () => {
      // Use the smaller/preview version of the blogPost from the 'blogPosts'
      // query as the placeholder data for this blogPost query
      return queryClient
        .getQueryData(["blogPosts"])
        ?.find((d) => d.id === blogPostId);
    },
  });
}
```

[//]: # "ExampleCache"
[//]: # "Materials"

## Leitura complementar

Para uma comparação entre `Placeholder Data` e `Initial Data`, veja o [artigo do TkDodo](https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query).

[//]: # "Materials"
