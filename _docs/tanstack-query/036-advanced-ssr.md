---
id: advanced-ssr
title: Advanced Server Rendering
---

Bem-vindo ao guia de Server Rendering Avançado, onde você aprenderá tudo sobre como usar o React Query com streaming, Server Components e o app router do Next.js.

Você pode querer ler o [guia de Server Rendering & Hydration](./ssr.md) antes deste, pois ele ensina o básico sobre o uso do React Query com SSR, e [Performance & Request Waterfalls](./request-waterfalls.md) assim como [Prefetching & Integração com Router](./prefetching.md) também contêm informações valiosas.

Antes de começarmos, vale notar que embora a abordagem com `initialData` descrita no guia de SSR também funcione com Server Components, vamos focar este guia nas APIs de hydration.

## Server Components & app router do Next.js

Não vamos cobrir Server Components em profundidade aqui, mas a versão resumida é que eles são components que têm a garantia de rodar _apenas_ no servidor, tanto para a visualização inicial da página quanto **também nas transições de página**. Isso é semelhante a como `getServerSideProps`/`getStaticProps` do Next.js e o `loader` do Remix funcionam, pois esses também sempre rodam no servidor, mas enquanto eles só podem retornar dados, Server Components podem fazer muito mais. A parte de dados é central para o React Query, no entanto, então vamos focar nisso.

Como pegamos o que aprendemos no guia de Server Rendering sobre [passar dados pré-buscados em loaders de framework para a aplicação](./ssr.md#using-the-hydration-apis) e aplicamos isso a Server Components e ao app router do Next.js? A melhor maneira de começar a pensar sobre isso é considerar Server Components como "apenas" mais um loader de framework.

### Uma nota rápida sobre terminologia

Até agora nestes guias, estávamos falando sobre o _servidor_ e o _cliente_. É importante notar que, de forma confusa, isso não corresponde 1-para-1 com _Server Components_ e _Client Components_. Server Components têm garantia de rodar apenas no servidor, mas Client Components podem na verdade rodar em ambos os lugares. A razão disso é que eles também podem renderizar durante a passagem inicial de _server rendering_.

Uma forma de pensar nisso é que, embora Server Components também _renderizem_, eles acontecem durante uma "fase de loader" (sempre acontece no servidor), enquanto Client Components rodam durante a "fase da aplicação". Essa aplicação pode rodar tanto no servidor durante o SSR quanto, por exemplo, em um navegador. Onde exatamente essa aplicação roda e se ela roda durante o SSR ou não pode diferir entre frameworks.

### Configuração inicial

O primeiro passo de qualquer configuração do React Query é sempre criar um `queryClient` e envolver sua aplicação em um `QueryClientProvider`. Com Server Components, isso se parece basicamente igual entre frameworks, uma diferença sendo as convenções de nomes de arquivos:

```tsx
// In Next.js, this file would be called: app/providers.tsx
"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

```tsx
// In Next.js, this file would be called: app/layout.tsx
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Essa parte é bem semelhante ao que fizemos no guia de SSR, só precisamos dividir as coisas em dois arquivos diferentes.

### Prefetching e de/hydration de dados

A seguir, vamos ver como realmente fazer prefetch de dados, e depois fazer dehydrate e hydrate deles. Era assim que ficava usando o **Next.js Pages Router**:

```tsx
// pages/posts.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";

// This could also be getServerSideProps
export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function Posts() {
  // This useQuery could just as well happen in some deeper child to
  // the <PostsRoute>, data will be available immediately either way
  //
  // Note that we are using useQuery here instead of useSuspenseQuery.
  // Because this data has already been prefetched, there is no need to
  // ever suspend in the component itself. If we forget or remove the
  // prefetch, this will instead fetch the data on the client, while
  // using useSuspenseQuery would have had worse side effects.
  const { data } = useQuery({ queryKey: ["posts"], queryFn: getPosts });

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix
  const { data: commentsData } = useQuery({
    queryKey: ["posts-comments"],
    queryFn: getComments,
  });

  // ...
}

export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  );
}
```

Converter isso para o app router na verdade fica bem parecido, só precisamos mover as coisas um pouco. Primeiro, vamos criar um Server Component para fazer a parte de prefetching:

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Posts from "./posts";

export default async function PostsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
```

Em seguida, vamos ver como fica a parte do Client Component:

```tsx
// app/posts/posts.tsx
"use client";

export default function Posts() {
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix.
  const { data: commentsData } = useQuery({
    queryKey: ["posts-comments"],
    queryFn: getComments,
  });

  // ...
}
```

Uma coisa legal sobre os exemplos acima é que a única coisa que é específica do Next.js aqui são os nomes dos arquivos, todo o resto ficaria igual em qualquer outro framework que suporte Server Components.

No guia de SSR, notamos que você poderia se livrar do boilerplate de ter `<HydrationBoundary>` em cada route. Isso não é possível com Server Components.

> NOTA: Se você encontrar um erro de tipo ao usar Server Components assíncronos com versões do TypeScript anteriores a `5.1.3` e versões de `@types/react` anteriores a `18.2.8`, é recomendado atualizar para as últimas versões de ambos. Alternativamente, você pode usar a solução temporária de adicionar `{/* @ts-expect-error Server Component */}` ao chamar este component dentro de outro. Para mais informações, veja [Async Server Component TypeScript Error](https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error) na documentação do Next.js 13.

> NOTA: Se você encontrar um erro `Only plain objects, and a few built-ins, can be passed to Server Actions. Classes or null prototypes are not supported.`, certifique-se de que você **não** está passando uma referência de função para queryFn; em vez disso, chame a função, porque os argumentos de queryFn têm diversas propriedades e nem todas seriam serializáveis. Veja [Server Action only works when queryFn isn't a reference](https://github.com/TanStack/query/issues/6264).

### Aninhando Server Components

Uma coisa legal sobre Server Components é que eles podem ser aninhados e existir em vários níveis na árvore React, tornando possível fazer prefetch de dados mais perto de onde eles são realmente usados, em vez de apenas no topo da aplicação (assim como os loaders do Remix). Isso pode ser tão simples quanto um Server Component renderizando outro Server Component (vamos deixar os Client Components de fora neste exemplo por brevidade):

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Posts from "./posts";
import CommentsServerComponent from "./comments-server";

export default async function PostsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
      <CommentsServerComponent />
    </HydrationBoundary>
  );
}

// app/posts/comments-server.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Comments from "./comments";

export default async function CommentsServerComponent() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts-comments"],
    queryFn: getComments,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comments />
    </HydrationBoundary>
  );
}
```

Como você pode ver, é perfeitamente válido usar `<HydrationBoundary>` em vários lugares, e criar e fazer dehydrate de múltiplos `queryClient` para prefetching.

Note que, como estamos aguardando `getPosts` antes de renderizar `CommentsServerComponent`, isso levaria a um waterfall no lado do servidor:

```
1. |> getPosts()
2.   |> getComments()
```

Se a latência do servidor para os dados for baixa, isso pode não ser um grande problema, mas ainda vale a pena mencionar.

No Next.js, além de fazer prefetch de dados em `page.tsx`, você também pode fazer em `layout.tsx`, e em [rotas paralelas](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes). Como todos fazem parte do roteamento, o Next.js sabe como buscá-los todos em paralelo. Então, se `CommentsServerComponent` acima fosse expresso como uma rota paralela, o waterfall seria achatado automaticamente.

À medida que mais frameworks começam a suportar Server Components, eles podem ter outras convenções de roteamento. Leia a documentação do seu framework para detalhes.

### Alternativa: Usar um único `queryClient` para prefetching

No exemplo acima, criamos um novo `queryClient` para cada Server Component que busca dados. Essa é a abordagem recomendada, mas se você quiser, pode alternativamente criar um único que é reutilizado entre todos os Server Components:

```tsx
// app/getQueryClient.tsx
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// cache() is scoped per request, so we don't leak data between requests
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
```

O benefício disso é que você pode chamar `getQueryClient()` para obter esse client em qualquer lugar que seja chamado a partir de um Server Component, incluindo funções utilitárias. A desvantagem é que toda vez que você chama `dehydrate(getQueryClient())`, você serializa _todo_ o `queryClient`, incluindo queries que já foram serializadas antes e não estão relacionadas ao Server Component atual, o que é overhead desnecessário.

O Next.js já deduplica requisições que utilizam `fetch()`, mas se você está usando algo diferente no seu `queryFn`, ou se você usa um framework que _não_ deduplica essas requisições automaticamente, usar um único `queryClient` como descrito acima pode fazer sentido, apesar da serialização duplicada.

> Como uma melhoria futura, podemos considerar criar uma função `dehydrateNew()` (nome pendente) que só faz dehydrate de queries que são _novas_ desde a última chamada a `dehydrateNew()`. Sinta-se à vontade para entrar em contato se isso parece interessante e algo com que você gostaria de ajudar!

### Propriedade dos dados e revalidação

Com Server Components, é importante pensar sobre propriedade dos dados e revalidação. Para explicar por quê, vamos ver um exemplo modificado do anterior:

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Posts from "./posts";

export default async function PostsPage() {
  const queryClient = new QueryClient();

  // Note we are now using fetchQuery()
  const posts = await queryClient.fetchQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* This is the new part */}
      <div>Nr of posts: {posts.length}</div>
      <Posts />
    </HydrationBoundary>
  );
}
```

Agora estamos renderizando dados da query `getPosts` tanto em um Server Component quanto em um Client Component. Isso vai funcionar bem para o render inicial da página, mas o que acontece quando a query revalida no cliente por algum motivo quando o `staleTime` tiver passado?

O React Query não tem como _revalidar o Server Component_, então se ele re-buscar os dados no cliente, fazendo o React re-renderizar a lista de posts, o `Nr of posts: {posts.length}` vai acabar dessincronizado.

Isso é aceitável se você definir `staleTime: Infinity`, para que o React Query nunca revalide, mas provavelmente não é isso que você quer se está usando React Query em primeiro lugar.

Usar React Query com Server Components faz mais sentido se:

- Você tem uma aplicação usando React Query e quer migrar para Server Components sem reescrever toda a busca de dados
- Você quer um paradigma de programação familiar, mas ainda quer aproveitar os benefícios de Server Components onde faz mais sentido
- Você tem algum caso de uso que o React Query cobre, mas que o framework que você escolheu não cobre

É difícil dar conselhos gerais sobre quando faz sentido combinar React Query com Server Components ou não. **Se você está apenas começando com uma nova aplicação com Server Components, sugerimos que comece com as ferramentas de busca de dados que seu framework oferece e evite trazer o React Query até que você realmente precise dele.** Isso pode ser nunca, e está tudo bem, use a ferramenta certa para o trabalho!

Se você usar, uma boa regra geral é evitar `queryClient.fetchQuery` a menos que você precise capturar erros. Se você usar, não renderize o resultado no servidor nem passe o resultado para outro component, mesmo um Client Component.

Da perspectiva do React Query, trate Server Components como um lugar para fazer prefetch de dados, nada mais.

Claro, é válido ter Server Components como donos de alguns dados, e Client Components donos de outros, apenas certifique-se de que essas duas realidades não fiquem dessincronizadas.

## Streaming com Server Components

O app router do Next.js automaticamente faz streaming de qualquer parte da aplicação que esteja pronta para ser exibida no navegador o mais rápido possível, para que o conteúdo finalizado possa ser exibido imediatamente sem esperar por conteúdo ainda pendente. Ele faz isso seguindo os limites de `<Suspense>`. Note que se você criar um arquivo `loading.tsx`, isso automaticamente cria um limite `<Suspense>` nos bastidores.

Com os padrões de prefetching descritos acima, o React Query é perfeitamente compatível com essa forma de streaming. Conforme os dados para cada limite de Suspense são resolvidos, o Next.js pode renderizar e fazer streaming do conteúdo finalizado para o navegador. Isso funciona mesmo se você estiver usando `useQuery` como descrito acima, porque a suspensão realmente acontece quando você faz `await` no prefetch.

A partir do React Query v5.40.0, você não precisa fazer `await` em todos os prefetches para que isso funcione, pois queries `pending` também podem ser desidratadas e enviadas para o cliente. Isso permite que você inicie prefetches o mais cedo possível sem deixá-los bloquear um limite de Suspense inteiro, e faz streaming dos _dados_ para o cliente conforme a query finaliza. Isso pode ser útil, por exemplo, se você quiser fazer prefetch de algum conteúdo que só é visível após alguma interação do usuário, ou se você quiser fazer `await` e renderizar a primeira página de uma query infinita, mas começar o prefetching da página 2 sem bloquear o rendering.

Para fazer isso funcionar, precisamos instruir o `queryClient` a também fazer `dehydrate` de queries pendentes. Podemos fazer isso globalmente, ou passando essa opção diretamente para `dehydrate`.

Também precisaremos mover a função `getQueryClient()` para fora do nosso arquivo `app/providers.tsx`, pois queremos usá-la tanto no nosso server component quanto no nosso client provider.

```tsx
// app/get-query-client.ts
import {
  isServer,
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldRedactErrors: (error) => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
```

> Nota: Isso funciona no NextJs e Server Components porque o React pode serializar Promises pela rede quando você as passa para Client Components.

Então, tudo que precisamos fazer é fornecer um `HydrationBoundary`, mas não precisamos mais fazer `await` nos prefetches:

```tsx
// app/posts/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";
import Posts from "./posts";

// the function doesn't need to be `async` because we don't `await` anything
export default function PostsPage() {
  const queryClient = getQueryClient();

  // look ma, no await
  queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
```

No cliente, a Promise será colocada no QueryCache para nós. Isso significa que agora podemos chamar `useSuspenseQuery` dentro do component `Posts` para "usar" essa Promise (que foi criada no Servidor):

```tsx
// app/posts/posts.tsx
"use client";

export default function Posts() {
  const { data } = useSuspenseQuery({ queryKey: ["posts"], queryFn: getPosts });

  // ...
}
```

> Note que você também poderia usar `useQuery` em vez de `useSuspenseQuery`, e a Promise ainda seria capturada corretamente. No entanto, o NextJs não vai suspender nesse caso e o component vai renderizar no status `pending`, o que também opta por não fazer server rendering do conteúdo.

Se você está usando tipos de dados que não são JSON e serializa os resultados da query no servidor, você pode especificar as opções `dehydrate.serializeData` e `hydrate.deserializeData` para serializar e desserializar os dados em cada lado do limite, garantindo que os dados no cache estejam no mesmo formato tanto no servidor quanto no cliente:

```tsx
// app/get-query-client.ts
import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { deserialize, serialize } from "./transformer";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // ...
      hydrate: {
        deserializeData: deserialize,
      },
      dehydrate: {
        serializeData: serialize,
      },
    },
  });
}

// ...
```

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";
import { serialize } from "./transformer";
import Posts from "./posts";

export default function PostsPage() {
  const queryClient = getQueryClient();

  // look ma, no await
  queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts().then(serialize), // <-- serialize the data on the server
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
```

```tsx
// app/posts/posts.tsx
"use client";

export default function Posts() {
  const { data } = useSuspenseQuery({ queryKey: ["posts"], queryFn: getPosts });

  // ...
}
```

Agora, sua função `getPosts` pode retornar, por exemplo, objetos de data e hora `Temporal` e os dados serão serializados e desserializados no cliente, assumindo que seu transformer consiga serializar e desserializar esses tipos de dados.

Para mais informações, confira o [Exemplo Next.js App com Prefetching](../examples/nextjs-app-prefetching).

### Usando o Persist Adapter com Streaming

Se você está usando o persist adapter com a funcionalidade de [Streaming com Server Components](#streaming-com-server-components), você precisa ter cuidado para não salvar promises no armazenamento. Como queries pendentes podem ser desidratadas e transmitidas via streaming para o cliente, você deve configurar o persister para persistir apenas queries bem-sucedidas:

```tsx
<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{
    persister,
    // We don't want to save promises into the storage, so we only persist successful queries
    dehydrateOptions: { shouldDehydrateQuery: defaultShouldDehydrateQuery },
  }}
>
  {children}
</PersistQueryClientProvider>
```

Isso garante que apenas queries resolvidas com sucesso sejam persistidas no armazenamento, prevenindo problemas de serialização com promises pendentes.

## Streaming experimental sem prefetching no Next.js

Embora recomendemos a solução de prefetching detalhada acima porque ela achata waterfalls de requisições tanto no carregamento inicial da página **quanto** em qualquer navegação subsequente, existe uma forma experimental de pular o prefetching completamente e ainda ter o streaming SSR funcionando: `@tanstack/react-query-next-experimental`

Este pacote permitirá que você busque dados no servidor (em um Client Component) simplesmente chamando `useSuspenseQuery` no seu component. Os resultados serão então transmitidos via streaming do servidor para o cliente conforme os SuspenseBoundaries são resolvidos. Se você chamar `useSuspenseQuery` sem envolvê-lo em um limite `<Suspense>`, a resposta HTML não começará até que o fetch seja resolvido. Isso pode ser o que você quer dependendo da situação, mas tenha em mente que isso vai prejudicar seu TTFB.

Para conseguir isso, envolva sua aplicação no component `ReactQueryStreamedHydration`:

```tsx
// app/providers.tsx
"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as React from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers(props: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
```

Para mais informações, confira o [Exemplo NextJs Suspense Streaming](../examples/nextjs-suspense-streaming).

A grande vantagem é que você não precisa mais fazer prefetch de queries manualmente para que o SSR funcione, e ele ainda faz streaming do resultado! Isso proporciona uma DX fenomenal e menor complexidade de código.

A desvantagem é mais fácil de explicar se olharmos de volta para [o exemplo de waterfall de requisições complexo](./request-waterfalls.md#code-splitting) no guia de Performance & Request Waterfalls. Server Components com prefetching efetivamente eliminam os waterfalls de requisições tanto para o carregamento inicial da página **quanto** para qualquer navegação subsequente. Essa abordagem sem prefetch, no entanto, só vai achatar os waterfalls no carregamento inicial da página, mas acaba no mesmo waterfall profundo do exemplo original nas navegações de página:

```
1. |> JS for <Feed>
2.   |> getFeed()
3.     |> JS for <GraphFeedItem>
4.       |> getGraphDataById()
```

Isso é ainda pior do que com `getServerSideProps`/`getStaticProps`, já que com esses nós podíamos pelo menos paralelizar a busca de dados e de código.

Se você valoriza DX/velocidade de iteração/entrega com baixa complexidade de código mais do que performance, não tem queries profundamente aninhadas, ou está por cima dos seus waterfalls de requisições com fetching paralelo usando ferramentas como `useSuspenseQueries`, essa pode ser uma boa troca.

> Pode ser possível combinar as duas abordagens, mas nem nós tentamos isso ainda. Se você tentar, por favor compartilhe suas descobertas, ou melhor ainda, atualize esses docs com algumas dicas!

## Palavras finais

Server Components e streaming ainda são conceitos relativamente novos e ainda estamos descobrindo como o React Query se encaixa e quais melhorias podemos fazer na API. Recebemos sugestões, feedback e relatórios de bugs com prazer!

Da mesma forma, seria impossível ensinar todas as nuances desse novo paradigma em um único guia, na primeira tentativa. Se você está sentindo falta de alguma informação aqui ou tem sugestões de como melhorar este conteúdo, também entre em contato, ou melhor ainda, clique no botão "Edit on GitHub" abaixo e nos ajude.

[//]: # "Materials"

## Leitura adicional

Para entender se sua aplicação pode se beneficiar do React Query ao usar também Server Components, veja o artigo [You Might Not Need React Query](https://tkdodo.eu/blog/you-might-not-need-react-query).

[//]: # "Materials"
