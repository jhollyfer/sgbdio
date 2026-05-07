---
id: prefetching
title: Prefetching & Router Integration
---

Quando você sabe ou suspeita que um determinado dado será necessário, pode usar prefetching para popular o cache com esses dados antecipadamente, resultando em uma experiência mais rápida.

Existem alguns padrões diferentes de prefetching:

1. Em event handlers
2. Em components
3. Via integração com router
4. Durante Server Rendering (outra forma de integração com router)

Neste guia, vamos analisar os três primeiros, enquanto o quarto será abordado em profundidade no [guia de Server Rendering & Hydration](./ssr.md) e no [guia Avançado de Server Rendering](./advanced-ssr.md).

Um uso específico de prefetching é evitar Request Waterfalls. Para um contexto aprofundado e explicação sobre eles, veja o [guia de Performance & Request Waterfalls](./request-waterfalls.md).

## prefetchQuery & prefetchInfiniteQuery

Antes de entrar nos diferentes padrões específicos de prefetch, vamos analisar as funções `prefetchQuery` e `prefetchInfiniteQuery`. Primeiro, alguns conceitos básicos:

- Por padrão, essas funções usam o `staleTime` configurado no `queryClient` para determinar se os dados existentes no cache estão fresh ou precisam ser buscados novamente
- Você também pode passar um `staleTime` específico assim: `prefetchQuery({ queryKey: ['todos'], queryFn: fn, staleTime: 5000 })`
  - Esse `staleTime` é usado apenas para o prefetch, você ainda precisa configurá-lo para qualquer chamada `useQuery` também
  - Se você quiser ignorar o `staleTime` e sempre retornar dados se estiverem disponíveis no cache, pode usar a função `ensureQueryData`.
  - Dica: Se você está fazendo prefetching no servidor, defina um `staleTime` padrão maior que `0` para aquele `queryClient` para evitar ter que passar um `staleTime` específico em cada chamada de prefetch
- Se nenhuma instância de `useQuery` aparecer para uma query com prefetch, ela será excluída e passará por garbage collection após o tempo especificado em `gcTime`
- Essas funções retornam `Promise<void>` e, portanto, nunca retornam dados da query. Se você precisa disso, use `fetchQuery`/`fetchInfiniteQuery` no lugar.
- As funções de prefetch nunca lançam erros porque normalmente tentam buscar novamente em um `useQuery`, que é um fallback elegante. Se você precisa capturar erros, use `fetchQuery`/`fetchInfiniteQuery` no lugar.

É assim que você usa `prefetchQuery`:

[//]: # "ExamplePrefetchQuery"

```tsx
const prefetchTodos = async () => {
  // The results of this query will be cached like a normal query
  await queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
};
```

[//]: # "ExamplePrefetchQuery"

Infinite Queries podem receber prefetch assim como Queries regulares. Por padrão, apenas a primeira página da Query receberá prefetch e será armazenada sob a QueryKey fornecida. Se você quiser fazer prefetch de mais de uma página, pode usar a opção `pages`, e nesse caso também precisa fornecer uma função `getNextPageParam`:

[//]: # "ExamplePrefetchInfiniteQuery"

```tsx
const prefetchProjects = async () => {
  // The results of this query will be cached like a normal query
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    pages: 3, // prefetch the first 3 pages
  });
};
```

[//]: # "ExamplePrefetchInfiniteQuery"

Agora, vamos ver como você pode usar essas e outras formas de prefetch em diferentes situações.

## Prefetch em event handlers

Uma forma direta de prefetching é fazê-lo quando o usuário interage com algo. Neste exemplo, usaremos `queryClient.prefetchQuery` para iniciar um prefetch no `onMouseEnter` ou `onFocus`.

[//]: # "ExampleEventHandler"

```tsx
function ShowDetailsButton() {
  const queryClient = useQueryClient()

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['details'],
      queryFn: getDetailsData,
      // Prefetch only fires when data is older than the staleTime,
      // so in a case like this you definitely want to set one
      staleTime: 60000,
    })
  }

  return (
    <button onMouseEnter={prefetch} onFocus={prefetch} onClick={...}>
      Show Details
    </button>
  )
}
```

[//]: # "ExampleEventHandler"

## Prefetch em components

Fazer prefetching durante o ciclo de vida do component é útil quando sabemos que algum filho ou descendente vai precisar de um determinado dado, mas não podemos renderizá-lo até que outra query termine de carregar. Vamos pegar emprestado um exemplo do guia de Request Waterfalls para explicar:

[//]: # "ExampleComponent"

```tsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  if (isPending) {
    return 'Loading article...'
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} />
    </>
  )
}

function Comments({ id }) {
  const { data, isPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  ...
}
```

[//]: # "ExampleComponent"

Isso resulta em um request waterfall assim:

```
1. |> getArticleById()
2.   |> getArticleCommentsById()
```

Como mencionado naquele guia, uma maneira de achatar esse waterfall e melhorar a performance é elevar a query `getArticleCommentsById` para o componente pai e passar o resultado como prop, mas e se isso não for viável ou desejável, por exemplo quando os components não são relacionados e têm múltiplos níveis entre eles?

Nesse caso, podemos fazer prefetch da query no componente pai. A maneira mais simples de fazer isso é usar uma query mas ignorar o resultado:

[//]: # "ExampleParentComponent"

```tsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  // Prefetch
  useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
    // Optional optimization to avoid rerenders when this query changes:
    notifyOnChangeProps: [],
  })

  if (isPending) {
    return 'Loading article...'
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} />
    </>
  )
}

function Comments({ id }) {
  const { data, isPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  ...
}
```

[//]: # "ExampleParentComponent"

Isso inicia o fetching de `'article-comments'` imediatamente e achata o waterfall:

```
1. |> getArticleById()
1. |> getArticleCommentsById()
```

[//]: # "Suspense"

Se você quiser fazer prefetch junto com Suspense, precisará fazer as coisas de forma um pouco diferente. Você não pode usar `useSuspenseQueries` para fazer prefetch, pois o prefetch bloquearia o rendering do component. Você também não pode usar `useQuery` para o prefetch, porque isso não iniciaria o prefetch até que a query suspenseful tivesse sido resolvida. Para esse cenário, você pode usar os hooks [`usePrefetchQuery`](../reference/usePrefetchQuery.md) ou [`usePrefetchInfiniteQuery`](../reference/usePrefetchInfiniteQuery.md) disponíveis na biblioteca.

Agora você pode usar `useSuspenseQuery` no component que realmente precisa dos dados. Você _pode_ querer envolver esse component posterior em seu próprio `<Suspense>` boundary para que a query "secundária" que estamos fazendo prefetch não bloqueie o rendering dos dados "primários".

```tsx
function ArticleLayout({ id }) {
  usePrefetchQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  return (
    <Suspense fallback="Loading article">
      <Article id={id} />
    </Suspense>
  )
}

function Article({ id }) {
  const { data: articleData, isPending } = useSuspenseQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  ...
}
```

Outra maneira é fazer prefetch dentro da função de query. Isso faz sentido se você sabe que toda vez que um artigo é buscado, é muito provável que os comentários também serão necessários. Para isso, usaremos `queryClient.prefetchQuery`:

```tsx
const queryClient = useQueryClient();
const { data: articleData, isPending } = useQuery({
  queryKey: ["article", id],
  queryFn: (...args) => {
    queryClient.prefetchQuery({
      queryKey: ["article-comments", id],
      queryFn: getArticleCommentsById,
    });

    return getArticleById(...args);
  },
});
```

Fazer prefetch em um efeito também funciona, mas note que se você estiver usando `useSuspenseQuery` no mesmo component, esse efeito não será executado até _após_ a query terminar, o que pode não ser o que você deseja.

```tsx
const queryClient = useQueryClient();

useEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ["article-comments", id],
    queryFn: getArticleCommentsById,
  });
}, [queryClient, id]);
```

Para recapitular, se você quer fazer prefetch de uma query durante o ciclo de vida do component, existem algumas maneiras diferentes de fazer isso; escolha a que melhor se adapta à sua situação:

- Fazer prefetch antes de um suspense boundary usando os hooks `usePrefetchQuery` ou `usePrefetchInfiniteQuery`
- Usar `useQuery` ou `useSuspenseQueries` e ignorar o resultado
- Fazer prefetch dentro da função de query
- Fazer prefetch em um efeito

Vamos analisar um caso um pouco mais avançado a seguir.

[//]: # "Suspense"

### Queries Dependentes & Code Splitting

Às vezes queremos fazer prefetch condicionalmente, baseado no resultado de outro fetch. Considere este exemplo emprestado do [guia de Performance & Request Waterfalls](./request-waterfalls.md):

[//]: # "ExampleConditionally1"

```tsx
// This lazy loads the GraphFeedItem component, meaning
// it wont start loading until something renders it
const GraphFeedItem = React.lazy(() => import('./GraphFeedItem'))

function Feed() {
  const { data, isPending } = useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
  })

  if (isPending) {
    return 'Loading feed...'
  }

  return (
    <>
      {data.map((feedItem) => {
        if (feedItem.type === 'GRAPH') {
          return <GraphFeedItem key={feedItem.id} feedItem={feedItem} />
        }

        return <StandardFeedItem key={feedItem.id} feedItem={feedItem} />
      })}
    </>
  )
}

// GraphFeedItem.tsx
function GraphFeedItem({ feedItem }) {
  const { data, isPending } = useQuery({
    queryKey: ['graph', feedItem.id],
    queryFn: getGraphDataById,
  })

  ...
}
```

[//]: # "ExampleConditionally1"

Como observado naquele guia, este exemplo leva ao seguinte request waterfall duplo:

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
3.     |> getGraphDataById()
```

Se não conseguirmos reestruturar nossa API para que `getFeed()` também retorne os dados de `getGraphDataById()` quando necessário, não há como eliminar o waterfall `getFeed->getGraphDataById`, mas aproveitando o prefetching condicional, podemos pelo menos carregar o código e os dados em paralelo. Assim como descrito acima, existem múltiplas maneiras de fazer isso, mas para este exemplo, faremos dentro da função de query:

[//]: # "ExampleConditionally2"

```tsx
function Feed() {
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery({
    queryKey: ['feed'],
    queryFn: async (...args) => {
      const feed = await getFeed(...args)

      for (const feedItem of feed) {
        if (feedItem.type === 'GRAPH') {
          queryClient.prefetchQuery({
            queryKey: ['graph', feedItem.id],
            queryFn: getGraphDataById,
          })
        }
      }

      return feed
    }
  })

  ...
}
```

[//]: # "ExampleConditionally2"

Isso carregaria o código e os dados em paralelo:

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
2.   |> getGraphDataById()
```

Há uma contrapartida, porém: o código para `getGraphDataById` agora está incluído no bundle pai em vez de em `JS for <GraphFeedItem>`, então você precisará determinar qual é a melhor troca de performance caso a caso. Se `GraphFeedItem` são prováveis, provavelmente vale a pena incluir o código no pai. Se são extremamente raros, provavelmente não.

[//]: # "Router"

## Integração com Router

Como o fetching de dados na própria árvore de components pode facilmente levar a request waterfalls e as diferentes correções para isso podem ser trabalhosas conforme se acumulam pela aplicação, uma maneira atrativa de fazer prefetching é integrá-lo no nível do router.

Nessa abordagem, você declara explicitamente para cada _route_ quais dados serão necessários para aquela árvore de components, antecipadamente. Como Server Rendering tradicionalmente precisava que todos os dados fossem carregados antes do rendering começar, essa tem sido a abordagem dominante para apps com SSR por muito tempo. Ainda é uma abordagem comum e você pode ler mais sobre isso no [guia de Server Rendering & Hydration](./ssr.md).

Por enquanto, vamos focar no caso do lado do cliente e ver um exemplo de como você pode fazer isso funcionar com o [TanStack Router](https://tanstack.com/router). Esses exemplos omitem muita configuração e boilerplate para ficarem concisos; você pode conferir um [exemplo completo com React Query](https://tanstack.com/router/latest/docs/framework/react/examples/basic-react-query-file-based) na [documentação do TanStack Router](https://tanstack.com/router/latest/docs).

Ao integrar no nível do router, você pode escolher _bloquear_ o rendering daquela route até que todos os dados estejam presentes, ou pode iniciar um prefetch mas não aguardar o resultado. Dessa forma, você pode começar a renderizar a route o mais rápido possível. Você também pode misturar essas duas abordagens e aguardar alguns dados críticos, mas começar o rendering antes que todos os dados secundários tenham terminado de carregar. Neste exemplo, vamos configurar uma route `/article` para não renderizar até que os dados do artigo terminem de carregar, assim como iniciar o prefetching de comentários o mais rápido possível, mas sem bloquear o rendering da route se os comentários ainda não tiverem terminado de carregar.

```tsx
const queryClient = new QueryClient()
const routerContext = new RouterContext()
const rootRoute = routerContext.createRootRoute({
  component: () => { ... }
})

const articleRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'article',
  beforeLoad: () => {
    return {
      articleQueryOptions: { queryKey: ['article'], queryFn: fetchArticle },
      commentsQueryOptions: { queryKey: ['comments'], queryFn: fetchComments },
    }
  },
  loader: async ({
    context: { queryClient },
    routeContext: { articleQueryOptions, commentsQueryOptions },
  }) => {
    // Fetch comments asap, but don't block
    queryClient.prefetchQuery(commentsQueryOptions)

    // Don't render the route at all until article has been fetched
    await queryClient.prefetchQuery(articleQueryOptions)
  },
  component: ({ useRouteContext }) => {
    const { articleQueryOptions, commentsQueryOptions } = useRouteContext()
    const articleQuery = useQuery(articleQueryOptions)
    const commentsQuery = useQuery(commentsQueryOptions)

    return (
      ...
    )
  },
  errorComponent: () => 'Oh crap!',
})
```

A integração com outros routers também é possível; veja o [react-router](../examples/react-router) para outra demonstração.

[//]: # "Router"

## Inicializando uma Query Manualmente

Se você já tem os dados para sua query disponíveis sincronamente, não precisa fazer prefetch. Você pode simplesmente usar o [método `setQueryData` do Query Client](../../../reference/QueryClient.md#queryclientsetquerydata) para adicionar ou atualizar diretamente o resultado em cache de uma query pela chave.

[//]: # "ExampleManualPriming"

```tsx
queryClient.setQueryData(["todos"], todos);
```

[//]: # "ExampleManualPriming"
[//]: # "Materials"

## Leitura complementar

Para um aprofundamento sobre como colocar dados no seu Query Cache antes de fazer fetch, veja o [artigo Seeding the Query Cache por TkDodo](https://tkdodo.eu/blog/seeding-the-query-cache).

Integrar com routers e frameworks do lado do servidor é muito semelhante ao que acabamos de ver, com o acréscimo de que os dados precisam ser passados do servidor para o cliente para serem hidratados no cache de lá. Para aprender como, continue para o [guia de Server Rendering & Hydration](./ssr.md).

[//]: # "Materials"
