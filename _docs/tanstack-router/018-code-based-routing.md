---
title: Code-Based Routing
---

> [!TIP]
> O code-based routing não é recomendado para a maioria das aplicações. É recomendado usar o [File-Based Routing](./file-based-routing.md) em vez disso.

## Antes de Começar

- Se você está usando [File-Based Routing](./file-based-routing.md), **pule este guia**.
- Se você ainda insiste em usar code-based routing, você deve ler o guia de [Routing Concepts](./routing-concepts.md) primeiro, pois ele também cobre conceitos fundamentais do router.

## Route Trees

O code-based routing não é diferente do file-based routing no sentido de que utiliza o mesmo conceito de route tree para organizar, combinar e compor routes correspondentes em uma árvore de components. A única diferença é que, em vez de usar o sistema de arquivos para organizar suas routes, você usa código.

Vamos considerar a mesma route tree do guia [Route Trees & Nesting](./route-trees.md#route-trees), e convertê-la para code-based routing:

Aqui está a versão file-based:

```
routes/
├── __root.tsx
├── index.tsx
├── about.tsx
├── posts/
│   ├── index.tsx
│   ├── $postId.tsx
├── posts.$postId.edit.tsx
├── settings/
│   ├── profile.tsx
│   ├── notifications.tsx
├── _pathlessLayout.tsx
├── _pathlessLayout/
│   ├── route-a.tsx
├── ├── route-b.tsx
├── files/
│   ├── $.tsx
```

E aqui está uma versão resumida em code-based:

```tsx
import { createRootRoute, createRoute } from "@tanstack/react-router";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "about",
});

const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "posts",
});

const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: "/",
});

const postRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: "$postId",
});

const postEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "posts/$postId/edit",
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "settings",
});

const profileRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "profile",
});

const notificationsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: "notifications",
});

const pathlessLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "pathlessLayout",
});

const pathlessLayoutARoute = createRoute({
  getParentRoute: () => pathlessLayoutRoute,
  path: "route-a",
});

const pathlessLayoutBRoute = createRoute({
  getParentRoute: () => pathlessLayoutRoute,
  path: "route-b",
});

const filesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "files/$",
});
```

## Anatomia de uma Route

Todas as routes, exceto a root route, são configuradas usando a função `createRoute`:

```tsx
const route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts",
  component: PostsComponent,
});
```

A opção `getParentRoute` é uma função que retorna a route pai da route que você está criando.

**"Espera, você está me fazendo passar a route pai para cada route que eu crio?"**

Com certeza! O motivo de passar a route pai tem **tudo a ver com a mágica do type safety** do TanStack Router. Sem a route pai, o TypeScript não teria ideia de quais tipos fornecer para a sua route!

> [!IMPORTANT]
> Para toda route que **NÃO** seja a **Root Route** ou uma **Pathless Layout Route**, a opção `path` é obrigatória. Este é o path que será comparado com o pathname da URL para determinar se a route é uma correspondência.

Ao configurar a opção `path` de uma route, barras iniciais e finais são ignoradas (isso não inclui paths de routes "index" `/`). Você pode incluí-las se quiser, mas elas serão normalizadas internamente pelo TanStack Router. Aqui está uma tabela de paths válidos e para o que eles serão normalizados:

| Path     | Normalized Path |
| -------- | --------------- |
| `/`      | `/`             |
| `/about` | `about`         |
| `about/` | `about`         |
| `about`  | `about`         |
| `$`      | `$`             |
| `/$`     | `$`             |
| `/$/`    | `$`             |

## Construindo a route tree manualmente

Ao construir uma route tree em código, não basta definir a route pai de cada route. Você também precisa construir a route tree final adicionando cada route ao array `children` da sua route pai. Isso porque a route tree não é construída automaticamente para você como no file-based routing.

```tsx
/* prettier-ignore */
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  postsRoute.addChildren([
    postsIndexRoute,
    postRoute,
  ]),
  postEditorRoute,
  settingsRoute.addChildren([
    profileRoute,
    notificationsRoute,
  ]),
  pathlessLayoutRoute.addChildren([
    pathlessLayoutARoute,
    pathlessLayoutBRoute,
  ]),
  filesRoute.addChildren([
    fileRoute,
  ]),
])
/* prettier-ignore-end */
```

Mas antes de ir em frente e construir a route tree, você precisa entender como os Conceitos de Routing para Code-Based Routing funcionam.

## Conceitos de Routing para Code-Based Routing

Acredite ou não, o file-based routing é na verdade um superconjunto do code-based routing e usa o sistema de arquivos e um pouco de abstração de geração de código por cima para gerar automaticamente essa estrutura que você vê acima.

Vamos assumir que você leu o guia de [Routing Concepts](./routing-concepts.md) e está familiarizado com cada um destes conceitos principais:

- A Root Route
- Routes Básicas
- Index Routes
- Segmentos Dinâmicos de Route
- Routes Splat / Catch-All
- Layout Routes
- Pathless Routes
- Routes Não-Aninhadas

Agora, vamos ver como criar cada um desses tipos de route em código.

## A Root Route

Criar uma root route em code-based routing é, felizmente, o mesmo que fazer no file-based routing. Chame a função `createRootRoute()`.

Diferentemente do file-based routing, no entanto, você não precisa exportar a root route se não quiser. Certamente não é recomendado construir uma route tree inteira e uma aplicação em um único arquivo (embora você possa, e fazemos isso nos exemplos para demonstrar conceitos de routing de forma breve).

```tsx
// Standard root route
import { createRootRoute } from "@tanstack/react-router";

const rootRoute = createRootRoute();

// Root route with Context
import { createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

export interface MyRouterContext {
  queryClient: QueryClient;
}
const rootRoute = createRootRouteWithContext<MyRouterContext>();
```

Para saber mais sobre Context no TanStack Router, veja o guia de [Router Context](../guide/router-context.md).

## Routes Básicas

Para criar uma route básica, simplesmente forneça uma string `path` normal para a função `createRoute`:

```tsx
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "about",
});
```

Viu, é simples assim! A `aboutRoute` vai corresponder à URL `/about`.

## Index Routes

Diferentemente do file-based routing, que usa o nome de arquivo `index` para denotar uma index route, o code-based routing usa uma única barra `/` para denotar uma index route. Por exemplo, o arquivo `posts.index.tsx` do nosso exemplo de route tree acima seria representado em code-based routing assim:

```tsx
const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "posts",
});

const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  // Notice the single slash `/` here
  path: "/",
});
```

Então, a `postsIndexRoute` vai corresponder à URL `/posts/` (ou `/posts`).

## Segmentos Dinâmicos de Route

Os segmentos dinâmicos de route funcionam exatamente da mesma forma no code-based routing e no file-based routing. Simplesmente prefixe um segmento do path com `$` e ele será capturado no objeto `params` do `loader` ou `component` da route:

```tsx
const postIdRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: "$postId",
  // In a loader
  loader: ({ params }) => fetchPost(params.postId),
  // Or in a component
  component: PostComponent,
});

function PostComponent() {
  const { postId } = postIdRoute.useParams();
  return <div>Post ID: {postId}</div>;
}
```

> [!TIP]
> Se o seu component é code-split, você pode usar a [função getRouteApi](../guide/code-splitting.md#manually-accessing-route-apis-in-other-files-with-the-getrouteapi-helper) para evitar ter que importar a configuração `postIdRoute` para acessar o hook tipado `useParams()`.

## Routes Splat / Catch-All

Como esperado, routes splat/catch-all também funcionam da mesma forma no code-based routing e no file-based routing. Simplesmente prefixe um segmento do path com `$` e ele será capturado no objeto `params` sob a chave `_splat`:

```tsx
const filesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "files",
});

const fileRoute = createRoute({
  getParentRoute: () => filesRoute,
  path: "$",
});
```

Para a URL `/documents/hello-world`, o objeto `params` ficará assim:

```js
{
  '_splat': 'documents/hello-world'
}
```

## Layout Routes

Layout routes são routes que envolvem seus filhos em um layout component. No code-based routing, você pode criar uma layout route simplesmente aninhando uma route dentro de outra:

```tsx
const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "posts",
  component: PostsLayoutComponent, // The layout component
});

function PostsLayoutComponent() {
  return (
    <div>
      <h1>Posts</h1>
      <Outlet />
    </div>
  );
}

const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: "/",
});

const postsCreateRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: "create",
});

const routeTree = rootRoute.addChildren([
  // The postsRoute is the layout route
  // Its children will be nested under the PostsLayoutComponent
  postsRoute.addChildren([postsIndexRoute, postsCreateRoute]),
]);
```

Agora, tanto a `postsIndexRoute` quanto a `postsCreateRoute` vão renderizar seu conteúdo dentro do `PostsLayoutComponent`:

```tsx
// URL: /posts
<PostsLayoutComponent>
  <PostsIndexComponent />
</PostsLayoutComponent>

// URL: /posts/create
<PostsLayoutComponent>
  <PostsCreateComponent />
</PostsLayoutComponent>
```

## Pathless Layout Routes

No file-based routing, uma pathless layout route é prefixada com `_`, mas no code-based routing, isso é simplesmente uma route com um `id` em vez de uma opção `path`. Isso porque o code-based routing não usa o sistema de arquivos para organizar routes, então não há necessidade de prefixar uma route com `_` para denotar que ela não tem path.

```tsx
const pathlessLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "pathlessLayout",
  component: PathlessLayoutComponent,
});

function PathlessLayoutComponent() {
  return (
    <div>
      <h1>Pathless Layout</h1>
      <Outlet />
    </div>
  );
}

const pathlessLayoutARoute = createRoute({
  getParentRoute: () => pathlessLayoutRoute,
  path: "route-a",
});

const pathlessLayoutBRoute = createRoute({
  getParentRoute: () => pathlessLayoutRoute,
  path: "route-b",
});

const routeTree = rootRoute.addChildren([
  // The pathless layout route has no path, only an id
  // So its children will be nested under the pathless layout route
  pathlessLayoutRoute.addChildren([pathlessLayoutARoute, pathlessLayoutBRoute]),
]);
```

Agora tanto `/route-a` quanto `/route-b` vão renderizar seu conteúdo dentro do `PathlessLayoutComponent`:

```tsx
// URL: /route-a
<PathlessLayoutComponent>
  <RouteAComponent />
</PathlessLayoutComponent>

// URL: /route-b
<PathlessLayoutComponent>
  <RouteBComponent />
</PathlessLayoutComponent>
```

## Routes Não-Aninhadas

Construir routes não-aninhadas em code-based routing não requer usar um `_` no final do path, mas requer que você construa sua route e route tree com os paths e aninhamento corretos. Vamos considerar a route tree onde queremos que o editor de post **não** seja aninhado sob a route de posts:

- `/posts_/$postId/edit`
- `/posts`
  - `$postId`

Para fazer isso, precisamos construir uma route separada para o editor de post e incluir o path inteiro na opção `path` a partir da raiz de onde queremos que a route seja aninhada (neste caso, a raiz):

```tsx
// The posts editor route is nested under the root route
const postEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  // The path includes the entire path we need to match
  path: "posts/$postId/edit",
});

const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "posts",
});

const postRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: "$postId",
});

const routeTree = rootRoute.addChildren([
  // The post editor route is nested under the root route
  postEditorRoute,
  postsRoute.addChildren([postRoute]),
]);
```
