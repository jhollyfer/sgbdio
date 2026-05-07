---
id: query-keys
title: Query Keys
---

Em sua essência, o TanStack Query gerencia o caching de queries para você com base nas query keys. As query keys precisam ser um Array no nível superior, e podem ser tão simples quanto um Array com uma única string, ou tão complexas quanto um array de muitas strings e objetos aninhados. Desde que a query key seja serializável usando `JSON.stringify`, e **única para os dados da query**, você pode usá-la!

## Query Keys Simples

A forma mais simples de uma key é um array com valores constantes. Esse formato é útil para:

- Recursos genéricos de lista/índice
- Recursos não-hierárquicos

[//]: # "Example"

```tsx
// A list of todos
useQuery({ queryKey: ['todos'], ... })

// Something else, whatever!
useQuery({ queryKey: ['something', 'special'], ... })
```

[//]: # "Example"

## Keys de Array com variáveis

Quando uma query precisa de mais informações para descrever seus dados de forma única, você pode usar um array com uma string e qualquer número de objetos serializáveis para descrevê-la. Isso é útil para:

- Recursos hierárquicos ou aninhados
  - É comum passar um ID, índice ou outro valor primitivo para identificar o item de forma única
- Queries com parâmetros adicionais
  - É comum passar um objeto de opções adicionais

[//]: # "Example2"

```tsx
// An individual todo
useQuery({ queryKey: ['todo', 5], ... })

// An individual todo in a "preview" format
useQuery({ queryKey: ['todo', 5, { preview: true }], ...})

// A list of todos that are "done"
useQuery({ queryKey: ['todos', { type: 'done' }], ... })
```

[//]: # "Example2"

## Query Keys são hasheadas de forma determinística!

Isso significa que, independentemente da ordem das keys nos objetos, todas as queries a seguir são consideradas iguais:

[//]: # "Example3"

```tsx
useQuery({ queryKey: ['todos', { status, page }], ... })
useQuery({ queryKey: ['todos', { page, status }], ...})
useQuery({ queryKey: ['todos', { page, status, other: undefined }], ... })
```

[//]: # "Example3"

As query keys a seguir, no entanto, não são iguais. A ordem dos itens no array importa!

[//]: # "Example4"

```tsx
useQuery({ queryKey: ['todos', status, page], ... })
useQuery({ queryKey: ['todos', page, status], ...})
useQuery({ queryKey: ['todos', undefined, page, status], ...})
```

[//]: # "Example4"

## Se sua função de query depende de uma variável, inclua-a na query key

Como as query keys descrevem de forma única os dados que estão sendo buscados, elas devem incluir quaisquer variáveis que você use na sua função de query que **mudam**. Por exemplo:

[//]: # "Example5"

```tsx
function Todos({ todoId }) {
  const result = useQuery({
    queryKey: ["todos", todoId],
    queryFn: () => fetchTodoById(todoId),
  });
}
```

[//]: # "Example5"

Note que as query keys atuam como dependências para suas funções de query. Adicionar variáveis dependentes à sua query key vai garantir que as queries sejam cacheadas independentemente, e que sempre que uma variável mudar, _as queries serão refetchadas automaticamente_ (dependendo das suas configurações de `staleTime`). Veja a seção [exhaustive-deps](../../../eslint/exhaustive-deps.md) para mais informações e exemplos.

[//]: # "Materials"

## Leitura complementar

Para dicas sobre organização de Query Keys em aplicações maiores, dê uma olhada em [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys) e confira o [Query Key Factory Package](https://github.com/lukemorales/query-key-factory) dos
[Community Resources](../../../community-resources).

[//]: # "Materials"
