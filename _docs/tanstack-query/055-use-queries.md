---
id: useQueries
title: useQueries
---

O hook `useQueries` pode ser usado para buscar um número variável de queries:

```tsx
const ids = [1, 2, 3];
const results = useQueries({
  queries: ids.map((id) => ({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
    staleTime: Infinity,
  })),
});
```

**Opções**

O hook `useQueries` aceita um objeto de opções com uma chave **queries** cujo valor é um array de objetos de opções de query idênticos ao [hook `useQuery`](./useQuery.md) (excluindo a opção `queryClient` - porque o `QueryClient` pode ser passado no nível superior).

- `queryClient?: QueryClient`
  - Use isto para fornecer um QueryClient personalizado. Caso contrário, o mais próximo do context será usado.
- `combine?: (result: UseQueriesResults) => TCombinedResult`
  - Use isto para combinar os resultados das queries em um único valor.

> Ter a mesma query key mais de uma vez no array de objetos de query pode fazer com que alguns dados sejam compartilhados entre queries. Para evitar isso, considere deduplicar as queries e mapear os resultados de volta para a estrutura desejada.

**placeholderData**

A opção `placeholderData` também existe para o `useQueries`, mas ela não recebe informações de Queries renderizadas anteriormente como o `useQuery` faz, porque a entrada do `useQueries` pode ter um número diferente de Queries em cada render.

**Retornos**

O hook `useQueries` retorna um array com todos os resultados das queries. A ordem retornada é a mesma da ordem de entrada.

## Combine

Se você quiser combinar `data` (ou outras informações de Query) dos resultados em um único valor, pode usar a opção `combine`. O resultado será estruturalmente compartilhado para ser o mais referencialmente estável possível.

```tsx
const ids = [1, 2, 3];
const combinedQueries = useQueries({
  queries: ids.map((id) => ({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
  })),
  combine: (results) => {
    return {
      data: results.map((result) => result.data),
      pending: results.some((result) => result.isPending),
    };
  },
});
```

No exemplo acima, `combinedQueries` será um objeto com as propriedades `data` e `pending`. Note que todas as outras propriedades dos resultados da Query serão perdidas.

### Memoização

A função `combine` só será reexecutada se:

- a própria função `combine` mudou referencialmente
- algum dos resultados das queries mudou

Isso significa que uma função `combine` inline, como mostrado acima, será executada a cada render. Para evitar isso, você pode envolver a função `combine` em `useCallback`, ou extraí-la para uma referência de função estável se ela não tiver dependências.
