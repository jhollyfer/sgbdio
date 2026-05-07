---
title: Routing Concepts
---

O TanStack Router suporta diversos conceitos poderosos de roteamento que permitem construir sistemas de roteamento complexos e dinâmicos com facilidade.

Cada um desses conceitos é útil e poderoso, e vamos nos aprofundar em cada um deles nas seções seguintes.

## Anatomia de uma Route

Todas as outras routes, exceto a [Root Route](#a-root-route), são configuradas usando a função `createFileRoute`, que fornece segurança de tipos ao usar roteamento baseado em arquivos:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: PostsComponent,
});
```

A função `createFileRoute` recebe um único argumento, o caminho da route do arquivo como uma string.

**"Espera, você está me fazendo passar o caminho do arquivo da route para `createFileRoute`?"**

Sim! Mas não se preocupe, esse caminho é **automaticamente escrito e gerenciado pelo router para você através do Plugin de Bundler do TanStack Router ou do Router CLI.** Então, à medida que você cria novas routes, move routes ou renomeia routes, o caminho será atualizado para você automaticamente.

A razão para esse pathname tem tudo a ver com a segurança de tipos mágica do TanStack Router. Sem esse pathname, o TypeScript não teria ideia em qual arquivo estamos! (Gostaríamos que o TypeScript tivesse algo nativo para isso, mas ainda não tem)

## A Root Route

A root route é a route mais alta em toda a árvore e encapsula todas as outras routes como filhas.

- Ela não tem caminho
- Ela é **sempre** correspondida
- Seu `component` é **sempre** renderizado

Mesmo sem ter um caminho, a root route tem acesso a todas as mesmas funcionalidades que outras routes, incluindo:

- components
- loaders
- validação de search params
- etc.

Para criar uma root route, chame a função `createRootRoute()` e exporte-a como a variável `Route` no seu arquivo de route:

```tsx
// Standard root route
import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute();

// Root route with Context
import { createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

export interface MyRouterContext {
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>();
```

Para saber mais sobre Context no TanStack Router, veja o guia de [Router Context](../guide/router-context.md).

## Routes Básicas

Routes básicas correspondem a um caminho específico, por exemplo `/about`, `/settings`, `/settings/notifications` são todas routes básicas, pois correspondem ao caminho exatamente.

Vamos dar uma olhada em uma route `/about`:

```tsx
// about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return <div>About</div>;
}
```

Routes básicas são simples e diretas. Elas correspondem ao caminho exatamente e renderizam o component fornecido.

## Index Routes

Index routes visam especificamente sua route pai quando ela é **correspondida exatamente e nenhuma route filha é correspondida**.

Vamos dar uma olhada em uma index route para a URL `/posts`:

```tsx
// posts.index.tsx
import { createFileRoute } from "@tanstack/react-router";

// Note the trailing slash, which is used to target index routes
export const Route = createFileRoute("/posts/")({
  component: PostsIndexComponent,
});

function PostsIndexComponent() {
  return <div>Please select a post!</div>;
}
```

Essa route será correspondida quando a URL for exatamente `/posts`.

## Segmentos Dinâmicos de Route

Segmentos de caminho de route que começam com um `$` seguido de um rótulo são dinâmicos e capturam aquela seção da URL no objeto `params` para uso na sua aplicação. Por exemplo, um pathname de `/posts/123` corresponderia à route `/posts/$postId`, e o objeto `params` seria `{ postId: '123' }`.

Esses params são então utilizáveis na configuração da sua route e nos components! Vamos ver uma route `posts.$postId.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  // In a loader
  loader: ({ params }) => fetchPost(params.postId),
  // Or in a component
  component: PostComponent,
});

function PostComponent() {
  // In a component!
  const { postId } = Route.useParams();
  return <div>Post ID: {postId}</div>;
}
```

> Segmentos dinâmicos funcionam em **cada** segmento do caminho. Por exemplo, você poderia ter uma route com o caminho `/posts/$postId/$revisionId` e cada segmento `$` seria capturado no objeto `params`.

## Routes Splat / Catch-All

Uma route com um caminho contendo apenas `$` é chamada de route "splat" porque ela _sempre_ captura _qualquer_ seção restante do pathname da URL do `$` até o final. O pathname capturado fica então disponível no objeto `params` sob a propriedade especial `_splat`.

Por exemplo, uma route direcionada ao caminho `files/$` é uma route splat. Se o pathname da URL for `/files/documents/hello-world`, o objeto `params` conteria `documents/hello-world` sob a propriedade especial `_splat`:

```js
{
  '_splat': 'documents/hello-world'
}
```

> Na v1 do router, routes splat também são denotadas com uma chave `*` em vez de `_splat` para compatibilidade retroativa. Isso será removido na v2.

> Por que usar `$`? Graças a ferramentas como o Remix, sabemos que apesar de `*` ser o caractere mais comum para representar um curinga, ele não funciona bem com nomes de arquivos ou ferramentas CLI, então assim como eles, decidimos usar `$` em vez disso.

## Parâmetros de Caminho Opcionais

Parâmetros de caminho opcionais permitem definir segmentos de route que podem ou não estar presentes na URL. Eles usam a sintaxe `{-$paramName}` e fornecem padrões de roteamento flexíveis onde certos parâmetros são opcionais.

```tsx
// posts.{-$category}.tsx - Optional category parameter
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/{-$category}")({
  component: PostsComponent,
});

function PostsComponent() {
  const { category } = Route.useParams();

  return <div>{category ? `Posts in ${category}` : "All Posts"}</div>;
}
```

Essa route corresponderá tanto a `/posts` (category é `undefined`) quanto a `/posts/tech` (category é `"tech"`).

Você também pode definir múltiplos parâmetros opcionais em uma única route:

```tsx
// posts.{-$category}.{-$slug}.tsx
export const Route = createFileRoute("/posts/{-$category}/{-$slug}")({
  component: PostsComponent,
});
```

Essa route corresponde a `/posts`, `/posts/tech` e `/posts/tech/hello-world`.

> Routes com parâmetros opcionais têm prioridade menor que correspondências exatas, garantindo que routes mais específicas como `/posts/featured` sejam correspondidas antes de `/posts/{-$category}`.

## Layout Routes

Layout routes são usadas para envolver routes filhas com components e lógica adicionais. Elas são úteis para:

- Envolver routes filhas com um layout component
- Impor um requisito de `loader` antes de exibir qualquer route filha
- Validar e fornecer search params para routes filhas
- Fornecer fallbacks para components de erro ou elementos pendentes para routes filhas
- Fornecer context compartilhado para todas as routes filhas
- E muito mais!

Vamos dar uma olhada em um exemplo de layout route chamada `app.tsx`:

```
routes/
├── app.tsx
├── app.dashboard.tsx
├── app.settings.tsx
```

Na árvore acima, `app.tsx` é uma layout route que envolve duas routes filhas, `app.dashboard.tsx` e `app.settings.tsx`.

Essa estrutura de árvore é usada para envolver as routes filhas com um layout component:

```tsx
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <div>
      <h1>App Layout</h1>
      <Outlet />
    </div>
  );
}
```

A tabela a seguir mostra qual(is) component(s) será(ão) renderizado(s) com base na URL:

| Caminho da URL   | Component                |
| ---------------- | ------------------------ |
| `/app`           | `<AppLayout>`            |
| `/app/dashboard` | `<AppLayout><Dashboard>` |
| `/app/settings`  | `<AppLayout><Settings>`  |

Como o TanStack Router suporta routes mistas (flat e diretório), você também pode expressar o roteamento da sua aplicação usando layout routes dentro de diretórios:

```
routes/
├── app/
│   ├── route.tsx
│   ├── dashboard.tsx
│   ├── settings.tsx
```

Nessa árvore aninhada, o arquivo `app/route.tsx` é a configuração da layout route que envolve duas routes filhas, `app/dashboard.tsx` e `app/settings.tsx`.

Layout Routes também permitem impor lógica de component e loader para Segmentos Dinâmicos de Route:

```
routes/
├── app/users/
│   ├── $userId/
|   |   ├── route.tsx
|   |   ├── index.tsx
|   |   ├── edit.tsx
```

## Pathless Layout Routes

Assim como as [Layout Routes](#layout-routes), Pathless Layout Routes são usadas para envolver routes filhas com components e lógica adicionais. No entanto, pathless layout routes não requerem um `path` correspondente na URL e são usadas para envolver routes filhas com components e lógica adicionais sem exigir um `path` correspondente na URL.

Pathless Layout Routes são prefixadas com um underscore (`_`) para denotar que são "pathless".

> A parte do caminho após o prefixo `_` é usada como o ID da route e é obrigatória porque cada route deve ser identificável de forma única, especialmente ao usar TypeScript para evitar erros de tipo e obter autocomplete de forma eficaz.

Vamos dar uma olhada em um exemplo de route chamada `_pathlessLayout.tsx`:

```

routes/
├── _pathlessLayout.tsx
├── _pathlessLayout.a.tsx
├── _pathlessLayout.b.tsx

```

Na árvore acima, `_pathlessLayout.tsx` é uma pathless layout route que envolve duas routes filhas, `_pathlessLayout.a.tsx` e `_pathlessLayout.b.tsx`.

A route `_pathlessLayout.tsx` é usada para envolver as routes filhas com um pathless layout component:

```tsx
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_pathlessLayout")({
  component: PathlessLayoutComponent,
});

function PathlessLayoutComponent() {
  return (
    <div>
      <h1>Pathless layout</h1>
      <Outlet />
    </div>
  );
}
```

A tabela a seguir mostra qual component será renderizado com base na URL:

| Caminho da URL | Component             |
| -------------- | --------------------- |
| `/`            | `<Index>`             |
| `/a`           | `<PathlessLayout><A>` |
| `/b`           | `<PathlessLayout><B>` |

Como o TanStack Router suporta routes mistas (flat e diretório), você também pode expressar o roteamento da sua aplicação usando pathless layout routes dentro de diretórios:

```
routes/
├── _pathlessLayout/
│   ├── route.tsx
│   ├── a.tsx
│   ├── b.tsx
```

No entanto, diferente das Layout Routes, como as Pathless Layout Routes não correspondem com base em segmentos de caminho da URL, isso significa que essas routes não suportam [Segmentos Dinâmicos de Route](#segmentos-dinâmicos-de-route) como parte do seu caminho e, portanto, não podem ser correspondidas na URL.

Isso significa que você não pode fazer isso:

```
routes/
├── _$postId/ ❌
│   ├── ...
```

Em vez disso, você teria que fazer isso:

```
routes/
├── $postId/
├── _postPathlessLayout/ ✅
│   ├── ...
```

## Routes Não-Aninhadas

Routes não-aninhadas podem ser criadas adicionando um sufixo `_` a um segmento de route pai e são usadas para **desaninhar** uma route dos seus pais e renderizar sua própria árvore de components.

Considere a seguinte árvore de routes flat:

```
routes/
├── posts.tsx
├── posts.$postId.tsx
├── posts_.$postId.edit.tsx
```

A tabela a seguir mostra qual component será renderizado com base na URL:

| Caminho da URL    | Component                    |
| ----------------- | ---------------------------- |
| `/posts`          | `<Posts>`                    |
| `/posts/123`      | `<Posts><Post postId="123">` |
| `/posts/123/edit` | `<PostEditor postId="123">`  |

- A route `posts.$postId.tsx` é aninhada normalmente sob a route `posts.tsx` e renderizará `<Posts><Post>`.
- A route `posts_.$postId.edit.tsx` **não compartilha** o mesmo prefixo `posts` que as outras routes e, portanto, será tratada como se fosse uma route de nível superior e renderizará `<PostEditor>`.

## Excluindo Arquivos e Pastas das Routes

Arquivos e pastas podem ser excluídos da geração de routes com um prefixo `-` anexado ao nome do arquivo. Isso oferece a capacidade de colocar lógica nos diretórios de route.

Considere a seguinte árvore de routes:

```
routes/
├── posts.tsx
├── -posts-table.tsx // 👈🏼 ignorado
├── -components/ // 👈🏼 ignorado
│   ├── header.tsx // 👈🏼 ignorado
│   ├── footer.tsx // 👈🏼 ignorado
│   ├── ...
```

Podemos importar dos arquivos excluídos na nossa route de posts

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { PostsTable } from "./-posts-table";
import { PostsHeader } from "./-components/header";
import { PostsFooter } from "./-components/footer";

export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
  component: PostComponent,
});

function PostComponent() {
  const posts = Route.useLoaderData();

  return (
    <div>
      <PostsHeader />
      <PostsTable posts={posts} />
      <PostsFooter />
    </div>
  );
}
```

Os arquivos excluídos não serão adicionados ao `routeTree.gen.ts`.

## Diretórios de Grupo de Routes sem Caminho

Diretórios de grupo de routes sem caminho usam `()` como uma forma de agrupar arquivos de routes independentemente do seu caminho. Eles são puramente organizacionais e não afetam a route tree ou a árvore de components de nenhuma forma.

```
routes/
├── index.tsx
├── (app)/
│   ├── dashboard.tsx
│   ├── settings.tsx
│   ├── users.tsx
├── (auth)/
│   ├── login.tsx
│   ├── register.tsx
```

No exemplo acima, os diretórios `app` e `auth` são puramente organizacionais e não afetam a route tree ou a árvore de components de nenhuma forma. Eles são usados para agrupar routes relacionadas para facilitar a navegação e organização.

A tabela a seguir mostra qual component será renderizado com base na URL:

| Caminho da URL | Component     |
| -------------- | ------------- |
| `/`            | `<Index>`     |
| `/dashboard`   | `<Dashboard>` |
| `/settings`    | `<Settings>`  |
| `/users`       | `<Users>`     |
| `/login`       | `<Login>`     |
| `/register`    | `<Register>`  |

Como você pode ver, os diretórios `app` e `auth` são puramente organizacionais e não afetam a route tree ou a árvore de components de nenhuma forma.
