---
id: request-waterfalls
title: Performance & Request Waterfalls
---

Performance de aplicações é uma área ampla e complexa, e embora o React Query não possa tornar suas APIs mais rápidas, ainda há coisas a se considerar em como você usa o React Query para garantir a melhor performance.

O maior problema de performance ao usar o React Query, ou qualquer biblioteca de fetching de dados que permite buscar dados dentro de components, são os request waterfalls (cascatas de requisições). O restante desta página explicará o que são, como identificá-los e como reestruturar sua aplicação ou APIs para evitá-los.

O [guia de Prefetching & Integração com Router](./prefetching.md) se baseia nisso e ensina como fazer prefetch de dados antecipadamente quando não é possível ou viável reestruturar sua aplicação ou APIs.

O [guia de Server Rendering & Hydration](./ssr.md) ensina como fazer prefetch de dados no servidor e passar esses dados para o client, para que você não precise buscá-los novamente.

O [guia Avançado de Server Rendering](./advanced-ssr.md) ensina ainda como aplicar esses padrões a Server Components e Streaming Server Rendering.

## O que é um Request Waterfall?

Um request waterfall é o que acontece quando uma requisição por um recurso (código, css, imagens, dados) não começa até _depois_ que outra requisição por um recurso tenha terminado.

Considere uma página web. Antes de carregar coisas como CSS, JS etc., o navegador primeiro precisa carregar o markup. Isso é um request waterfall.

```
1. |-> Markup
2.   |-> CSS
2.   |-> JS
2.   |-> Image
```

Se você buscar seu CSS dentro de um arquivo JS, agora você tem um waterfall duplo:

```
1. |-> Markup
2.   |-> JS
3.     |-> CSS
```

Se esse CSS usa uma imagem de fundo, é um waterfall triplo:

```
1. |-> Markup
2.   |-> JS
3.     |-> CSS
4.       |-> Image
```

A melhor maneira de identificar e analisar seus request waterfalls geralmente é abrindo a aba "Network" das ferramentas de desenvolvedor do seu navegador.

Cada waterfall representa pelo menos uma ida e volta ao servidor, a menos que o recurso esteja armazenado em cache local (na prática, alguns desses waterfalls podem representar mais de uma ida e volta porque o navegador precisa estabelecer uma conexão que requer algumas trocas, mas vamos ignorar isso aqui). Por causa disso, os efeitos negativos dos request waterfalls dependem muito da latência do usuário. Considere o exemplo do waterfall triplo, que na verdade representa 4 idas e voltas ao servidor. Com 250ms de latência, o que não é incomum em redes 3G ou em condições ruins de rede, acabamos com um tempo total de 4*250=1000ms **contando apenas a latência**. Se pudéssemos achatar isso para o primeiro exemplo com apenas 2 idas e voltas, teríamos 500ms, possivelmente carregando aquela imagem de fundo na metade do tempo!

## Request Waterfalls e React Query

Agora vamos considerar o React Query. Vamos focar primeiro no caso sem Server Rendering. Antes de podermos sequer começar a fazer uma query, precisamos carregar o JS, então antes de mostrarmos os dados na tela, temos um waterfall duplo:

```
1. |-> Markup
2.   |-> JS
3.     |-> Query
```

Com isso como base, vamos analisar alguns padrões diferentes que podem levar a Request Waterfalls no React Query, e como evitá-los.

- Waterfalls de Component Único / Queries Seriais
- Waterfalls de Components Aninhados
- Code Splitting

### Waterfalls de Component Único / Queries Seriais

Quando um único component primeiro busca uma query, e depois outra, isso é um request waterfall. Isso pode acontecer quando a segunda query é uma [Query Dependente](./dependent-queries.md), ou seja, ela depende dos dados da primeira query para fazer o fetching:

```tsx
// Get the user
const { data: user } = useQuery({
  queryKey: ["user", email],
  queryFn: getUserByEmail,
});

const userId = user?.id;

// Then get the user's projects
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ["projects", userId],
  queryFn: getProjectsByUser,
  // The query will not execute until the userId exists
  enabled: !!userId,
});
```

Embora nem sempre seja viável, para performance ótima é melhor reestruturar sua API para poder buscar ambos em uma única query. No exemplo acima, em vez de primeiro buscar `getUserByEmail` para poder chamar `getProjectsByUser`, introduzir uma nova query `getProjectsByUserEmail` achataria o waterfall.

> Outra maneira de mitigar queries dependentes sem reestruturar sua API é mover o waterfall para o servidor onde a latência é menor. Essa é a ideia por trás dos Server Components, que são abordados no [guia Avançado de Server Rendering](./advanced-ssr.md).

Outro exemplo de queries seriais é quando você usa o React Query com Suspense:

```tsx
function App () {
  // The following queries will execute in serial, causing separate roundtrips to the server:
  const usersQuery = useSuspenseQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const teamsQuery = useSuspenseQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const projectsQuery = useSuspenseQuery({ queryKey: ['projects'], queryFn: fetchProjects })

  // Note that since the queries above suspend rendering, no data
  // gets rendered until all of the queries finished
  ...
}
```

Note que com `useQuery` regular, essas queries aconteceriam em paralelo.

Felizmente, isso é fácil de resolver, sempre usando o hook `useSuspenseQueries` quando você tem múltiplas queries com suspense em um component.

```tsx
const [usersQuery, teamsQuery, projectsQuery] = useSuspenseQueries({
  queries: [
    { queryKey: ["users"], queryFn: fetchUsers },
    { queryKey: ["teams"], queryFn: fetchTeams },
    { queryKey: ["projects"], queryFn: fetchProjects },
  ],
});
```

### Waterfalls de Components Aninhados

Waterfalls de Components Aninhados acontecem quando tanto um component pai quanto um filho contêm queries, e o pai não renderiza o filho até que sua query esteja concluída. Isso pode acontecer tanto com `useQuery` quanto com `useSuspenseQuery`.

Se o filho renderiza condicionalmente baseado nos dados do pai, ou se o filho depende de parte do resultado sendo passado como prop do pai para fazer sua query, temos um waterfall aninhado _dependente_.

Vamos primeiro ver um exemplo onde o filho **não** depende do pai.

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

Note que embora `<Comments>` receba uma prop `id` do pai, esse id já está disponível quando o `<Article>` renderiza, então não há razão para não buscarmos os comentários ao mesmo tempo que o artigo. Em aplicações reais, o filho pode estar aninhado muito abaixo do pai e esse tipo de waterfall é frequentemente mais difícil de identificar e corrigir, mas para nosso exemplo, uma maneira de achatar o waterfall seria elevar a query de comentários para o pai:

```tsx
function Article({ id }) {
  const { data: articleData, isPending: articlePending } = useQuery({
    queryKey: ["article", id],
    queryFn: getArticleById,
  });

  const { data: commentsData, isPending: commentsPending } = useQuery({
    queryKey: ["article-comments", id],
    queryFn: getArticleCommentsById,
  });

  if (articlePending) {
    return "Loading article...";
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      {commentsPending ? (
        "Loading comments..."
      ) : (
        <Comments commentsData={commentsData} />
      )}
    </>
  );
}
```

As duas queries agora farão fetch em paralelo. Note que se você estiver usando suspense, você vai querer combinar essas duas queries em um único `useSuspenseQueries`.

Outra maneira de achatar esse waterfall seria fazer prefetch dos comentários no component `<Article>`, ou fazer prefetch de ambas as queries no nível do router no carregamento ou navegação de página. Leia mais sobre isso no [guia de Prefetching & Integração com Router](./prefetching.md).

Em seguida, vamos ver um _Waterfall Aninhado Dependente_.

```tsx
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

function GraphFeedItem({ feedItem }) {
  const { data, isPending } = useQuery({
    queryKey: ['graph', feedItem.id],
    queryFn: getGraphDataById,
  })

  ...
}
```

A segunda query `getGraphDataById` depende do pai de duas maneiras diferentes. Primeiro, ela nunca acontece a menos que o `feedItem` seja um graph, e segundo, ela precisa de um `id` do pai.

```
1. |> getFeed()
2.   |> getGraphDataById()
```

Neste exemplo, não podemos simplesmente achatar o waterfall elevando a query para o pai, ou mesmo adicionando prefetching. Assim como o exemplo de query dependente no início deste guia, uma opção é refatorar nossa API para incluir os dados do graph na query `getFeed`. Outra solução mais avançada é aproveitar os Server Components para mover o waterfall para o servidor onde a latência é menor (leia mais sobre isso no [guia Avançado de Server Rendering](./advanced-ssr.md)), mas note que isso pode ser uma mudança arquitetural muito grande.

Você pode ter boa performance mesmo com alguns query waterfalls aqui e ali, apenas saiba que eles são uma preocupação comum de performance e fique atento a eles. Uma versão especialmente problemática é quando code splitting está envolvido, vamos ver isso a seguir.

### Code Splitting

Dividir o código JS de uma aplicação em pedaços menores e carregar apenas as partes necessárias é geralmente um passo crítico para alcançar boa performance. Porém, isso tem uma desvantagem: frequentemente introduz request waterfalls. Quando esse código dividido também tem uma query dentro dele, o problema é agravado.

Considere esta versão ligeiramente modificada do exemplo do Feed.

[//]: # "LazyExample"

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

[//]: # "LazyExample"

Este exemplo tem um waterfall duplo, ficando assim:

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
3.     |> getGraphDataById()
```

Mas isso é olhando apenas o código do exemplo. Se considerarmos como seria o primeiro carregamento desta página, na verdade precisamos completar 5 idas e voltas ao servidor antes de renderizar o graph!

```
1. |> Markup
2.   |> JS for <Feed>
3.     |> getFeed()
4.       |> JS for <GraphFeedItem>
5.         |> getGraphDataById()
```

Note que isso fica um pouco diferente com server rendering, vamos explorar isso no [guia de Server Rendering & Hydration](./ssr.md). Note também que não é incomum que a route que contém `<Feed>` também seja code split, o que poderia adicionar mais um salto.

No caso de code splitting, pode realmente ajudar elevar a query `getGraphDataById` para o component `<Feed>` e torná-la condicional, ou adicionar um prefetch condicional. Essa query poderia então ser buscada em paralelo com o código, transformando a parte do exemplo nisso:

```
1. |> getFeed()
2.   |> getGraphDataById()
2.   |> JS for <GraphFeedItem>
```

Isso é muito uma questão de tradeoff, no entanto. Você está agora incluindo o código de fetching de dados para `getGraphDataById` no mesmo bundle que `<Feed>`, então avalie o que é melhor para o seu caso. Leia mais sobre como fazer isso no [guia de Prefetching & Integração com Router](./prefetching.md).

> O tradeoff entre:
>
> - Incluir todo o código de fetching de dados no bundle principal, mesmo que raramente o usemos
> - Colocar o código de fetching de dados no bundle do code split, mas com um request waterfall
>
> não é ideal e tem sido uma das motivações para os Server Components. Com Server Components, é possível evitar ambos. Leia mais sobre como isso se aplica ao React Query no [guia Avançado de Server Rendering](./advanced-ssr.md).

## Resumo e conclusões

Request Waterfalls são uma preocupação de performance muito comum e complexa, com muitos tradeoffs. Há muitas maneiras de introduzi-los acidentalmente na sua aplicação:

- Adicionar uma query a um filho, sem perceber que um pai já tem uma query
- Adicionar uma query a um pai, sem perceber que um filho já tem uma query
- Mover um component com descendentes que têm uma query para um novo pai com um ancestral que tem uma query
- Etc..

Por causa dessa complexidade acidental, vale a pena ficar atento aos waterfalls e examinar regularmente sua aplicação procurando por eles (uma boa maneira é examinar a aba Network de vez em quando!). Você não precisa necessariamente achatar todos para ter boa performance, mas fique de olho nos de alto impacto.

No próximo guia, veremos mais maneiras de achatar waterfalls, aproveitando [Prefetching & Integração com Router](./prefetching.md).
