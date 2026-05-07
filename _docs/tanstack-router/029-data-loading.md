---
id: data-loading
title: Data Loading
---

O carregamento de dados é uma preocupação comum em aplicações web e está relacionado ao roteamento. Ao carregar uma página da sua aplicação, o ideal é que todos os requisitos assíncronos da página sejam buscados e resolvidos o mais cedo possível, em paralelo. O router é o melhor lugar para coordenar essas dependências assíncronas, pois geralmente é o único lugar na sua aplicação que sabe para onde os usuários estão indo antes do conteúdo ser renderizado.

Você pode estar familiarizado com `getServerSideProps` do Next.js ou `loader`s do Remix/React-Router. O TanStack Router tem funcionalidade similar para pré-carregar/carregar assets por route em paralelo, permitindo que renderize o mais rápido possível enquanto busca via suspense.

Além dessas expectativas normais de um router, o TanStack Router vai além e fornece **cache SWR integrado**, uma camada de cache de longo prazo em memória para loaders de route. Isso significa que você pode usar o TanStack Router tanto para pré-carregar dados para suas routes para que carreguem instantaneamente, quanto para cachear temporariamente dados de routes previamente visitadas para usar novamente mais tarde.

## O ciclo de vida de carregamento da route

Toda vez que uma atualização de URL/histórico é detectada, o router executa a seguinte sequência:

- Correspondência de Route (De Cima para Baixo)
  - `route.params.parse`
  - `route.validateSearch`
- Pré-Carregamento da Route (Serial)
  - `route.beforeLoad`
  - `route.onError`
    - `route.errorComponent` / `parentRoute.errorComponent` / `router.defaultErrorComponent`
- Carregamento da Route (Paralelo)
  - `route.component.preload?`
  - `route.loader`
    - `route.pendingComponent` (Opcional)
    - `route.component`
  - `route.onError`
    - `route.errorComponent` / `parentRoute.errorComponent` / `router.defaultErrorComponent`

## Usar o Cache do Router ou não?

Há uma grande possibilidade de que o cache do router do TanStack seja uma boa opção para a maioria das aplicações de pequeno a médio porte, mas é importante entender os trade-offs de usá-lo versus uma solução de cache mais robusta como o TanStack Query:

Prós do Cache do TanStack Router:

- Integrado, fácil de usar, sem dependências extras
- Lida com deduplicação, preloading, carregamento, stale-while-revalidate, refetching em segundo plano por route
- Invalidação grosseira (invalida todas as routes e cache de uma vez)
- Garbage collection automático
- Funciona muito bem para aplicações que compartilham poucos dados entre routes
- "Simplesmente funciona" para SSR

Contras do Cache do TanStack Router:

- Sem adapters/modelo de persistência
- Sem cache compartilhado/deduplicação entre routes
- Sem APIs de mutation integradas (um hook básico `useMutation` é fornecido em muitos exemplos que pode ser suficiente para muitos casos de uso)
- Sem APIs de atualização otimista em nível de cache integradas (você ainda pode usar state efêmero de algo como um hook `useMutation` para alcançar isso no nível do component)

> [!TIP]
> Se você já sabe que gostaria de ou precisa usar algo mais robusto como o TanStack Query, pule para o guia de [Carregamento de Dados Externo](./external-data-loading.md).

## Usando o Cache do Router

O cache do router é integrado e é tão fácil quanto retornar dados da função `loader` de qualquer route. Vamos aprender como!

## `loader`s de Route

Funções `loader` de route são chamadas quando um route match é carregado. Elas são chamadas com um único parâmetro que é um objeto contendo muitas propriedades úteis. Vamos ver essas propriedades em breve, mas primeiro, vamos olhar um exemplo de uma função `loader` de route:

```tsx
// routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
});
```

## Parâmetros do `loader`

A função `loader` recebe um único objeto com as seguintes propriedades:

- `abortController` - O abortController da route. Seu signal é cancelado quando a route é descarregada ou quando a Route não é mais relevante e a invocação atual da função `loader` se torna desatualizada.
- `cause` - A causa do route match atual. Pode ser uma das seguintes:
  - `enter` - Quando a route é correspondida e carregada após não ser correspondida na localização anterior.
  - `preload` - Quando a route está sendo pré-carregada.
  - `stay` - Quando a route é correspondida e carregada após ser correspondida na localização anterior.
- `context` - O objeto de context da route, que é uma união mesclada de:
  - Context da route pai
  - Context desta route conforme fornecido pela opção `beforeLoad`
- `deps` - O valor do objeto retornado pela função `Route.loaderDeps`. Se `Route.loaderDeps` não está definido, um objeto vazio será fornecido.
- `location` - A localização atual
- `params` - Os path params da route
- `parentMatchPromise` - `Promise<RouteMatch>` (`undefined` para a route raiz)
- `preload` - Booleano que é `true` quando a route está sendo pré-carregada em vez de carregada
- `route` - A própria route

Usando esses parâmetros, podemos fazer muitas coisas legais, mas primeiro, vamos ver como podemos controlar quando a função `loader` é chamada.

## Consumindo dados dos `loader`s

Para consumir dados de um `loader`, use o hook `useLoaderData` definido no seu objeto Route.

```tsx
const posts = Route.useLoaderData();
```

Se você não tem acesso fácil ao seu objeto route (ou seja, você está profundo na árvore de components da route atual), pode usar `getRouteApi` para acessar o mesmo hook (assim como os outros hooks no objeto Route). Isso deve ser preferido em vez de importar o objeto Route, o que provavelmente criaria dependências circulares.

```tsx
import { getRouteApi } from "@tanstack/react-router";

// in your component

const routeApi = getRouteApi("/posts");
const data = routeApi.useLoaderData();
```

## Cache Stale-While-Revalidate Baseado em Dependências

O TanStack Router fornece uma camada de cache Stale-While-Revalidate integrada para loaders de route que é chaveada nas dependências de uma route:

- O pathname totalmente analisado da route
  - ex.: `/posts/1` vs `/posts/2`
- Quaisquer dependências adicionais fornecidas pela opção `loaderDeps`
  - ex.: `loaderDeps: ({ search: { pageIndex, pageSize } }) => ({ pageIndex, pageSize })`

Usando essas dependências como chaves, o TanStack Router irá cachear os dados retornados pela função `loader` de uma route e usá-los para atender requisições subsequentes para o mesmo route match. Isso significa que se os dados de uma route já estão no cache, eles serão retornados imediatamente, e então **potencialmente** serão rebuscados em segundo plano dependendo do "frescor" dos dados.

### Opções principais

Para controlar dependências do router e "frescor", o TanStack Router fornece uma infinidade de opções para controlar o comportamento de chaveamento e cache dos seus loaders de route. Vamos olhá-las na ordem em que você mais provavelmente as usará:

- `routeOptions.loaderDeps`
  - Uma função que fornece os search params de um router e retorna um objeto de dependências para uso na sua função `loader`. Quando essas deps mudam de navegação para navegação, isso causará o recarregamento da route independentemente dos `staleTime`s. As deps são comparadas usando uma verificação de igualdade profunda.
- `routeOptions.staleTime`
- `routerOptions.defaultStaleTime`
  - O número de milissegundos que os dados de uma route devem ser considerados frescos ao tentar carregar.
- `routeOptions.preloadStaleTime`
- `routerOptions.defaultPreloadStaleTime`
  - O número de milissegundos que os dados de uma route devem ser considerados frescos ao tentar pré-carregar.
- `routeOptions.gcTime`
- `routerOptions.defaultGcTime`
  - O número de milissegundos que os dados de uma route devem ser mantidos no cache antes de serem coletados pelo garbage collector.
- `routeOptions.shouldReload`
  - Uma função que recebe os mesmos parâmetros de `beforeLoad` e `loaderContext` e retorna um booleano indicando se a route deve recarregar. Isso oferece mais um nível de controle sobre quando uma route deve recarregar além de `staleTime` e `loaderDeps` e pode ser usado para implementar padrões similares à opção `shouldLoad` do Remix.

### Alguns Padrões Importantes

- Por padrão, o `staleTime` é definido como `0`, o que significa que os dados da route serão sempre considerados stale e sempre serão recarregados em segundo plano quando a route for re-correspondida.
- Por padrão, uma route previamente pré-carregada é considerada fresh por **30 segundos**. Isso significa que se uma route é pré-carregada e depois pré-carregada novamente dentro de 30 segundos, o segundo pré-carregamento será ignorado. Isso previne pré-carregamentos desnecessários de acontecerem com muita frequência. **Quando uma route é carregada normalmente, o `staleTime` padrão é usado.**
- Por padrão, o `gcTime` é definido como **30 minutos**, o que significa que quaisquer dados de route que não foram acessados em 30 minutos serão coletados pelo garbage collector e removidos do cache.
- `router.invalidate()` forçará todas as routes ativas a recarregarem seus loaders imediatamente e marcará os dados de cada route no cache como stale.

### Usando `loaderDeps` para acessar search params

Imagine uma route `/posts` que suporta paginação via search params `offset` e `limit`. Para que o cache armazene esses dados de forma única, precisamos acessar esses search params via a função `loaderDeps`. Ao identificá-los explicitamente, cada route match para `/posts` com `offset` e `limit` diferentes não será confundido!

Uma vez que temos essas deps configuradas, a route sempre recarregará quando as deps mudarem.

```tsx
// /routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loaderDeps: ({ search: { offset, limit } }) => ({ offset, limit }),
  loader: ({ deps: { offset, limit } }) =>
    fetchPosts({
      offset,
      limit,
    }),
});
```

> [!WARNING]
> **Inclua apenas dependências que você realmente usa no loader.**
>
> Um erro comum é retornar o objeto `search` inteiro:
>
> ```tsx
> // ❌ Don't do this - causes unnecessary cache invalidation
> loaderDeps: ({ search }) => search,
> loader: ({ deps }) => fetchPosts({ page: deps.page }), // only uses page!
> ```
>
> Isso faz com que a route recarregue sempre que QUALQUER search param muda, mesmo params não usados no loader (como `viewMode` ou `sortDirection`). Em vez disso, extraia apenas o que você precisa:
>
> ```tsx
> // ✅ Do this - only reload when used params change
> loaderDeps: ({ search }) => ({
>   page: search.page,
>   limit: search.limit,
> }),
> loader: ({ deps }) => fetchPosts(deps),
> ```

### Usando `staleTime` para controlar quanto tempo os dados são considerados frescos

Por padrão, o `staleTime` para navegações é definido como `0`ms (e 30 segundos para preloads), o que significa que os dados da route serão sempre considerados stale e sempre serão recarregados em segundo plano quando a route for correspondida e navegada.

**Esse é um bom padrão para a maioria dos casos de uso, mas você pode achar que alguns dados de route são mais estáticos ou potencialmente caros de carregar.** Nesses casos, você pode usar a opção `staleTime` para controlar quanto tempo os dados da route são considerados frescos para navegações. Vamos ver um exemplo:

```tsx
// /routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
  // Consider the route's data fresh for 10 seconds
  staleTime: 10_000,
});
```

Ao passar `10_000` para a opção `staleTime`, estamos dizendo ao router para considerar os dados da route frescos por 10 segundos. Isso significa que se o usuário navegar para `/posts` a partir de `/about` dentro de 10 segundos do último resultado do loader, os dados da route não serão recarregados. Se o usuário então navegar para `/posts` a partir de `/about` após 10 segundos, os dados da route serão recarregados **em segundo plano**.

## Desativando o cache stale-while-revalidate

Para desativar o cache stale-while-revalidate para uma route, defina a opção `staleTime` como `Infinity`:

```tsx
// /routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
  staleTime: Infinity,
});
```

Você pode até desativar isso para todas as routes definindo a opção `defaultStaleTime` no router:

```tsx
const router = createRouter({
  routeTree,
  defaultStaleTime: Infinity,
});
```

## Usando `shouldReload` e `gcTime` para desativar o cache

Similar à funcionalidade padrão do Remix, você pode querer configurar uma route para carregar apenas na entrada ou quando dependências críticas do loader mudam. Você pode fazer isso usando a opção `gcTime` combinada com a opção `shouldReload`, que aceita um `boolean` ou uma função que recebe os mesmos parâmetros de `beforeLoad` e `loaderContext` e retorna um booleano indicando se a route deve recarregar.

```tsx
// /routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loaderDeps: ({ search: { offset, limit } }) => ({ offset, limit }),
  loader: ({ deps }) => fetchPosts(deps),
  // Do not cache this route's data after it's unloaded
  gcTime: 0,
  // Only reload the route when the user navigates to it or when deps change
  shouldReload: false,
});
```

### Desativando o cache enquanto ainda mantém o preloading

Mesmo que você desative o cache de curto prazo para os dados da sua route, ainda pode obter os benefícios do preloading! Com a configuração acima, o preloading ainda "simplesmente funcionará" com o `preloadGcTime` padrão. Isso significa que se uma route é pré-carregada e depois navegada, os dados da route serão considerados frescos e não serão recarregados.

Para desativar o preloading, não o ative via as opções `routerOptions.defaultPreload` ou `routeOptions.preload`.

## Passando todos os eventos do loader para um cache externo

Detalhamos esse caso de uso na página de [Carregamento de Dados Externo](./external-data-loading.md), mas se você quiser usar um cache externo como o TanStack Query, pode fazer isso passando todos os eventos do loader para seu cache externo. Desde que você esteja usando os padrões, a única mudança que precisará fazer é definir a opção `defaultPreloadStaleTime` no router para `0`:

```tsx
const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
});
```

Isso garantirá que cada evento de preload, carregamento e recarregamento acionará suas funções `loader`, que podem então ser tratadas e deduplicadas pelo seu cache externo.

## Usando Router Context

O argumento `context` passado para a função `loader` é um objeto contendo uma união mesclada de:

- Context da route pai
- Context desta route conforme fornecido pela opção `beforeLoad`

Começando bem no topo do router, você pode passar um context inicial para o router via a opção `context`. Esse context estará disponível para todas as routes no router e será copiado e estendido por cada route conforme são correspondidas. Isso acontece passando um context para uma route via a opção `beforeLoad`. Esse context estará disponível para todas as routes filhas da route. O context resultante estará disponível para a função `loader` da route.

Neste exemplo, criaremos uma função no context da nossa route para buscar posts, e então a usaremos na nossa função `loader`.

> 🧠 Context é uma ferramenta poderosa para injeção de dependências. Você pode usá-lo para injetar serviços, hooks e outros objetos no seu router e routes. Você também pode passar dados aditivamente pela árvore de routes em cada route usando a opção `beforeLoad` da route.

- `/utils/fetchPosts.tsx`

```tsx
export const fetchPosts = async () => {
  const res = await fetch(`/api/posts?page=${pageIndex}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};
```

- `/routes/__root.tsx`

```tsx
import { createRootRouteWithContext } from "@tanstack/react-router";

// Create a root route using the createRootRouteWithContext<{...}>() function and pass it whatever types you would like to be available in your router context.
export const Route = createRootRouteWithContext<{
  fetchPosts: typeof fetchPosts;
}>()(); // NOTE: the double call is on purpose, since createRootRouteWithContext is a factory ;)
```

- `/routes/posts.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";

// Notice how our postsRoute references context to get our fetchPosts function
// This can be a powerful tool for dependency injection across your router
// and routes.
export const Route = createFileRoute("/posts")({
  loader: ({ context: { fetchPosts } }) => fetchPosts(),
});
```

- `/router.tsx`

```tsx
import { routeTree } from "./routeTree.gen";

// Use your routerContext to create a new router
// This will require that you fullfil the type requirements of the routerContext
const router = createRouter({
  routeTree,
  context: {
    // Supply the fetchPosts function to the router context
    fetchPosts,
  },
});
```

## Usando Path Params

Para usar path params na sua função `loader`, acesse-os via a propriedade `params` nos parâmetros da função. Aqui está um exemplo:

```tsx
// routes/posts.$postId.tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: ({ params: { postId } }) => fetchPostById(postId),
});
```

## Usando Route Context

Passar context global para o seu router é ótimo, mas e se você quiser fornecer context que é específico de uma route? É aí que a opção `beforeLoad` entra. A opção `beforeLoad` é uma função que executa logo antes de tentar carregar uma route e recebe os mesmos parâmetros que `loader`. Além da sua capacidade de redirecionar correspondências potenciais, bloquear requisições de loader, etc., ela também pode retornar um objeto que será mesclado no context da route. Vamos ver um exemplo onde injetamos alguns dados no context da nossa route via a opção `beforeLoad`:

```tsx
// /routes/posts.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  // Pass the fetchPosts function to the route context
  beforeLoad: () => ({
    fetchPosts: () => console.info("foo"),
  }),
  loader: ({ context: { fetchPosts } }) => {
    fetchPosts(); // 'foo'

    // ...
  },
});
```

## Usando Search Params em Loaders

> Mas espera Tanner... onde diabos estão meus search params?!

Você pode estar aqui se perguntando por que `search` não está diretamente disponível nos parâmetros da função `loader`. Projetamos assim propositalmente para ajudá-lo a ter sucesso. Vamos ver o porquê:

- Search params sendo usados em uma função de loader são um indicador muito bom de que esses search params também devem ser usados para identificar unicamente os dados sendo carregados. Por exemplo, você pode ter uma route que usa um search param como `pageIndex` que identifica unicamente os dados mantidos dentro do route match. Ou, imagine uma route `/users/user` que usa o search param `userId` para identificar um usuário específico na sua aplicação, você poderia modelar sua url assim: `/users/user?userId=123`. Isso significa que sua route `user` precisaria de alguma ajuda extra para identificar um usuário específico.
- Acessar search params diretamente em uma função de loader pode levar a bugs no cache e preloading onde os dados sendo carregados não são únicos para o pathname da URL atual e search params. Por exemplo, você pode pedir à sua route `/posts` para pré-carregar os resultados da página 2, mas sem a distinção de páginas na configuração da sua route, você acabará buscando, armazenando e exibindo os dados da página 2 na tela `/posts` ou `?page=1` em vez de pré-carregar em segundo plano!
- Colocar um limiar entre search params e a função de loader permite que o router entenda suas dependências e reatividade.

```tsx
// /routes/users.user.tsx
export const Route = createFileRoute("/users/user")({
  validateSearch: (search) =>
    search as {
      userId: string;
    },
  loaderDeps: ({ search: { userId } }) => ({
    userId,
  }),
  loader: async ({ deps: { userId } }) => getUser(userId),
});
```

### Acessando Search Params via `routeOptions.loaderDeps`

```tsx
// /routes/posts.tsx
export const Route = createFileRoute("/posts")({
  // Use zod to validate and parse the search params
  validateSearch: z.object({
    offset: z.number().int().nonnegative().catch(0),
  }),
  // Pass the offset to your loader deps via the loaderDeps function
  loaderDeps: ({ search: { offset } }) => ({ offset }),
  // Use the offset from context in the loader function
  loader: async ({ deps: { offset } }) =>
    fetchPosts({
      offset,
    }),
});
```

## Usando o Abort Signal

A propriedade `abortController` da função `loader` é um [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController). Seu signal é cancelado quando a route é descarregada ou quando a chamada do `loader` se torna desatualizada. Isso é útil para cancelar requisições de rede quando a route é descarregada ou quando os params da route mudam. Aqui está um exemplo usando-o com uma chamada fetch:

```tsx
// routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loader: ({ abortController }) =>
    fetchPosts({
      // Pass this to an underlying fetch call or anything that supports signals
      signal: abortController.signal,
    }),
});
```

## Usando a flag `preload`

A propriedade `preload` da função `loader` é um booleano que é `true` quando a route está sendo pré-carregada em vez de carregada. Algumas bibliotecas de carregamento de dados podem lidar com preloading de forma diferente de um fetch padrão, então você pode querer passar `preload` para sua biblioteca de carregamento de dados, ou usá-lo para executar a lógica de carregamento de dados apropriada:

```tsx
// routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loader: async ({ preload }) =>
    fetchPosts({
      maxAge: preload ? 10_000 : 0, // Preloads should hang around a bit longer
    }),
});
```

## Lidando com Loaders Lentos

Idealmente, a maioria dos loaders de route pode resolver seus dados em um curto momento, removendo a necessidade de renderizar um spinner de placeholder e simplesmente confiando no suspense para renderizar a próxima route quando estiver completamente pronta. Quando dados críticos necessários para renderizar o component de uma route são lentos, no entanto, você tem 2 opções:

- Dividir seus dados rápidos e lentos em promises separadas e `defer` (adiar) os dados lentos até que os dados rápidos sejam carregados (veja o guia de [Carregamento de Dados Adiado](./deferred-data-loading.md)).
- Mostrar um component pendente após um limiar otimista de suspense até que todos os dados estejam prontos (veja abaixo).

## Mostrando um component pendente

**Por padrão, o TanStack Router mostrará um component pendente para loaders que levam mais de 1 segundo para resolver.** Esse é um limiar otimista que pode ser configurado via:

- `routeOptions.pendingMs` ou
- `routerOptions.defaultPendingMs`

Quando o limiar de tempo pendente é excedido, o router renderizará a opção `pendingComponent` da route, se configurada.

## Evitando Flash do Component Pendente

Se você está usando um component pendente, a última coisa que você quer é que o limiar de tempo pendente seja atingido e depois seus dados resolverem imediatamente após, resultando em um flash brusco do seu component pendente. Para evitar isso, **o TanStack Router por padrão mostrará seu component pendente por pelo menos 500ms**. Esse é um limiar otimista que pode ser configurado via:

- `routeOptions.pendingMinMs` ou
- `routerOptions.defaultPendingMinMs`

## Lidando com Erros

O TanStack Router fornece algumas formas de lidar com erros que ocorrem durante o ciclo de vida de carregamento da route. Vamos ver.

### Lidando com Erros com `routeOptions.onError`

A opção `routeOptions.onError` é uma função que é chamada quando um erro ocorre durante o carregamento da route.

```tsx
// routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
  onError: ({ error }) => {
    // Log the error
    console.error(error);
  },
});
```

### Lidando com Erros com `routeOptions.onCatch`

A opção `routeOptions.onCatch` é uma função que é chamada sempre que um erro é capturado pelo CatchBoundary do router.

```tsx
// routes/posts.tsx
export const Route = createFileRoute("/posts")({
  onCatch: ({ error, errorInfo }) => {
    // Log the error
    console.error(error);
  },
});
```

### Lidando com Erros com `routeOptions.errorComponent`

A opção `routeOptions.errorComponent` é um component que é renderizado quando um erro ocorre durante o ciclo de vida de carregamento ou rendering da route. Ele é renderizado com as seguintes props:

- `error` - O erro que ocorreu
- `reset` - Uma função para resetar o `CatchBoundary` interno

```tsx
// routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
  errorComponent: ({ error }) => {
    // Render an error message
    return <div>{error.message}</div>;
  },
});
```

A função `reset` pode ser usada para permitir que o usuário tente novamente renderizar os filhos normais do error boundary:

```tsx
// routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
  errorComponent: ({ error, reset }) => {
    return (
      <div>
        {error.message}
        <button
          onClick={() => {
            // Reset the router error boundary
            reset();
          }}
        >
          retry
        </button>
      </div>
    );
  },
});
```

Se o erro foi resultado de um carregamento de route, você deve chamar `router.invalidate()`, que coordenará tanto um recarregamento do router quanto um reset do error boundary:

```tsx
// routes/posts.tsx
export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();

    return (
      <div>
        {error.message}
        <button
          onClick={() => {
            // Invalidate the route to reload the loader, which will also reset the error boundary
            router.invalidate();
          }}
        >
          retry
        </button>
      </div>
    );
  },
});
```

### Usando o `ErrorComponent` padrão

O TanStack Router fornece um `ErrorComponent` padrão que é renderizado quando um erro ocorre durante o ciclo de vida de carregamento ou rendering da route. Se você optar por sobrescrever os error components das suas routes, ainda é prudente sempre fazer fallback para renderizar quaisquer erros não capturados com o `ErrorComponent` padrão:

```tsx
// routes/posts.tsx
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
  errorComponent: ({ error }) => {
    if (error instanceof MyCustomError) {
      // Render a custom error message
      return <div>{error.message}</div>;
    }

    // Fallback to the default ErrorComponent
    return <ErrorComponent error={error} />;
  },
});
```
