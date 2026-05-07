---
id: render-optimizations
title: Render Optimizations
---

O React Query aplica algumas otimizações automaticamente para garantir que seus components só re-renderizem quando realmente precisarem. Isso é feito através dos seguintes mecanismos:

## structural sharing

O React Query usa uma técnica chamada "structural sharing" para garantir que o máximo possível de referências seja mantido intacto entre re-renders. Se os dados são buscados pela rede, normalmente você obtém uma referência completamente nova ao fazer o parse do JSON da resposta. No entanto, o React Query mantém a referência original se _nada_ mudou nos dados. Se um subconjunto mudou, o React Query mantém as partes inalteradas e substitui apenas as partes que mudaram.

> Nota: Essa otimização só funciona se a `queryFn` retorna dados compatíveis com JSON. Você pode desativá-la definindo `structuralSharing: false` globalmente ou por query individual, ou pode implementar seu próprio structural sharing passando uma função para ela.

### referential identity

O objeto de nível superior retornado por `useQuery`, `useInfiniteQuery`, `useMutation` e o Array retornado por `useQueries` **não é referencialmente estável**. Será uma nova referência a cada render. No entanto, as propriedades `data` retornadas por esses hooks serão tão estáveis quanto possível.

## tracked properties

O React Query só disparará um re-render se uma das propriedades retornadas por `useQuery` for realmente "usada". Isso é feito usando [Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Isso evita muitos re-renders desnecessários, por exemplo, porque propriedades como `isFetching` ou `isStale` podem mudar frequentemente, mas não são usadas no component.

Você pode personalizar esse recurso definindo `notifyOnChangeProps` manualmente, globalmente ou por query individual. Se quiser desativar esse recurso, defina `notifyOnChangeProps: 'all'`.

> Nota: O trap get de um proxy é invocado ao acessar uma propriedade, seja via desestruturação ou acessando diretamente. Se você usar desestruturação com rest, desabilitará essa otimização. Temos uma [regra de lint](../../../eslint/no-rest-destructuring.md) para proteger contra essa armadilha.

## select

Você pode usar a opção `select` para selecionar um subconjunto dos dados ao qual seu component deve se inscrever. Isso é útil para transformações de dados altamente otimizadas ou para evitar re-renders desnecessários.

```js
export const useTodos = (select) => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    select,
  });
};

export const useTodoCount = () => {
  return useTodos((data) => data.length);
};
```

Um component usando o hook customizado `useTodoCount` só re-renderizará se o tamanho da lista de todos mudar. Ele **não** re-renderizará se, por exemplo, o nome de um todo mudar.

> Nota: `select` opera sobre dados cacheados com sucesso e não é o lugar apropriado para lançar erros. A fonte de verdade para erros é a `queryFn`, e uma função `select` que retorna um erro resulta em `data` sendo `undefined` e `isSuccess` sendo `true`. Recomendamos tratar erros na `queryFn` se você deseja que uma query falhe com dados incorretos, ou fora do hook de query se você tem um caso de erro não relacionado ao caching.

### memoization

A função `select` só será re-executada se:

- a própria função `select` mudou referencialmente
- `data` mudou

Isso significa que uma função `select` inline, como mostrado acima, será executada em todo render. Para evitar isso, você pode envolver a função `select` em `useCallback`, ou extraí-la para uma referência de função estável se ela não tiver dependências:

```js
// wrapped in useCallback
export const useTodoCount = () => {
  return useTodos(useCallback((data) => data.length, []));
};
```

```js
// extracted to a stable function reference
const selectTodoCount = (data) => data.length;

export const useTodoCount = () => {
  return useTodos(selectTodoCount);
};
```

## Leitura complementar

Para um guia aprofundado sobre esses tópicos, leia [React Query Render Optimizations](https://tkdodo.eu/blog/react-query-render-optimizations) do TkDodo. Para aprender como otimizar melhor a opção `select`, leia [React Query Selectors, Supercharged](https://tkdodo.eu/blog/react-query-selectors-supercharged)
