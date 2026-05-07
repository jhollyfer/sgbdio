---
title: Not Found Errors
---

> ⚠️ Esta pagina cobre a função `notFound` mais recente e a API `notFoundComponent` para tratar erros de "não encontrado". O route `NotFoundRoute` está depreciado e será removido em uma versão futura. Veja [Migrando do `NotFoundRoute`](#migrating-from-notfoundroute) para mais informações.

## Visão Geral

Existem 2 usos para erros de "não encontrado" no TanStack Router:

- **Caminhos de route que não correspondem**: Quando um caminho não corresponde a nenhum padrão de correspondência de route conhecido **OU** quando corresponde parcialmente a um route, mas com segmentos de caminho extras
  - O **router** vai automaticamente lançar um erro de "não encontrado" quando um caminho não corresponde a nenhum padrão de correspondência de route conhecido
  - Se o `notFoundMode` do router estiver definido como `fuzzy`, o route pai mais próximo com um `notFoundComponent` vai tratar o erro. Se o `notFoundMode` do router estiver definido como `root`, o route raiz vai tratar o erro.
  - Exemplos:
    - Tentar acessar `/users` quando não existe um route `/users`
    - Tentar acessar `/posts/1/edit` quando a árvore de routes só trata `/posts/$postId`
- **Recursos ausentes**: Quando um recurso não pode ser encontrado, como um post com um determinado ID ou qualquer dado assíncrono que não está disponível ou não existe
  - **Você, o desenvolvedor** deve lançar um erro de "não encontrado" quando um recurso não pode ser encontrado. Isso pode ser feito nas funções `beforeLoad` ou `loader` usando o utilitário `notFound`.
  - Será tratado pelo route pai mais próximo com um `notFoundComponent` (quando `notFound` é chamado dentro do `loader`) ou pelo route raiz.
  - Exemplos:
    - Tentar acessar `/posts/1` quando o post com ID 1 não existe
    - Tentar acessar `/docs/path/to/document` quando o documento não existe

Por baixo dos panos, ambos os casos são implementados usando a mesma função `notFound` e a API `notFoundComponent`.

## A opção `notFoundMode`

Quando o TanStack Router encontra um **pathname** que não corresponde a nenhum padrão de route conhecido **OU** corresponde parcialmente a um padrão de route mas com segmentos extras de pathname ao final, ele automaticamente lança um erro de "não encontrado".

Dependendo da opção `notFoundMode`, o router vai tratar esses erros automáticos de forma diferente:

- [Modo "fuzzy"](#notfoundmode-fuzzy) (padrão): O router vai encontrar de forma inteligente o route correspondente mais próximo adequado e exibir o `notFoundComponent`.
- [Modo "root"](#notfoundmode-root): Todos os erros de "não encontrado" serão tratados pelo `notFoundComponent` do route raiz, independentemente do route correspondente mais próximo.

### `notFoundMode: 'fuzzy'`

Por padrão, o `notFoundMode` do router é definido como `fuzzy`, o que indica que se um pathname não corresponder a nenhum route conhecido, o router vai tentar usar o route correspondente mais próximo que tenha filhos/(um outlet) e um component de "não encontrado" configurado.

> **❓ Por que esse é o padrão?** A correspondência fuzzy preserva o máximo possível do layout pai para o usuário, dando a ele mais contexto para navegar até um local útil com base em onde ele achava que iria chegar.

O route adequado mais próximo é encontrado usando os seguintes critérios:

- O route deve ter filhos e, portanto, um `Outlet` para renderizar o `notFoundComponent`
- O route deve ter um `notFoundComponent` configurado ou o router deve ter um `defaultNotFoundComponent` configurado

Por exemplo, considere a seguinte árvore de routes:

- `__root__` (tem um `notFoundComponent` configurado)
  - `posts` (tem um `notFoundComponent` configurado)
    - `$postId` (tem um `notFoundComponent` configurado)

Se for fornecido o caminho `/posts/1/edit`, a seguinte estrutura de components será renderizada:

- `<Root>`
  - `<Posts>`
    - `<Posts.notFoundComponent>`

O `notFoundComponent` do route `posts` será renderizado porque é o **route pai adequado mais próximo com filhos (e, portanto, um outlet) e um `notFoundComponent` configurado**.

### `notFoundMode: 'root'`

Quando `notFoundMode` está definido como `root`, todos os erros de "não encontrado" serão tratados pelo `notFoundComponent` do route raiz em vez de propagar a partir do route mais próximo com correspondência fuzzy.

Por exemplo, considere a seguinte árvore de routes:

- `__root__` (tem um `notFoundComponent` configurado)
  - `posts` (tem um `notFoundComponent` configurado)
    - `$postId` (tem um `notFoundComponent` configurado)

Se for fornecido o caminho `/posts/1/edit`, a seguinte estrutura de components será renderizada:

- `<Root>`
  - `<Root.notFoundComponent>`

O `notFoundComponent` do route `__root__` será renderizado porque o `notFoundMode` está definido como `root`.

## Configurando o `notFoundComponent` de um route

Para tratar ambos os tipos de erros de "não encontrado", você pode anexar um `notFoundComponent` a um route. Esse component será renderizado quando um erro de "não encontrado" for lançado.

Por exemplo, configurando um `notFoundComponent` para um route `/settings` para tratar páginas de configuração inexistentes:

```tsx
export const Route = createFileRoute("/settings")({
  component: () => {
    return (
      <div>
        <p>Settings page</p>
        <Outlet />
      </div>
    );
  },
  notFoundComponent: () => {
    return <p>This setting page doesn't exist!</p>;
  },
});
```

Ou configurando um `notFoundComponent` para um route `/posts/$postId` para tratar posts que não existem:

```tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ params: { postId } }) => {
    const post = await getPost(postId);
    if (!post) throw notFound();
    return { post };
  },
  component: ({ post }) => {
    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </div>
    );
  },
  notFoundComponent: () => {
    return <p>Post not found!</p>;
  },
});
```

## Tratamento Padrão de "Não Encontrado" em Todo o Router

Você pode querer fornecer um component padrão de "não encontrado" para cada route no seu app que tenha routes filhos.

> Por que apenas routes com filhos? **Routes folha (routes sem filhos) nunca renderizarão um `Outlet` e, portanto, não são capazes de tratar erros de "não encontrado".**

Para fazer isso, passe um `defaultNotFoundComponent` para a função `createRouter`:

```tsx
const router = createRouter({
  defaultNotFoundComponent: () => {
    return (
      <div>
        <p>Not found!</p>
        <Link to="/">Go home</Link>
      </div>
    );
  },
});
```

## Lançando seus próprios erros `notFound`

Você pode lançar manualmente erros de "não encontrado" em métodos de loader e components usando a função `notFound`. Isso é útil quando você precisa sinalizar que um recurso não pode ser encontrado.

A função `notFound` funciona de maneira semelhante à função `redirect`. Para causar um erro de "não encontrado", você pode **lançar um `notFound()`**.

```tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ params: { postId } }) => {
    // Returns `null` if the post doesn't exist
    const post = await getPost(postId);
    if (!post) {
      throw notFound();
      // Alternatively, you can make the notFound function throw:
      // notFound({ throw: true })
    }
    // Post is guaranteed to be defined here because we threw an error
    return { post };
  },
});
```

O erro de "não encontrado" acima será tratado pelo mesmo route ou pelo route pai mais próximo que tenha a opção de route `notFoundComponent` ou a opção de router `defaultNotFoundComponent` configurada.

Se nem o route nem nenhum route pai adequado for encontrado para tratar o erro, o route raiz vai tratá-lo usando o component padrão de "não encontrado" **extremamente básico (e propositalmente indesejável)** do TanStack Router que simplesmente renderiza `<p>Not Found</p>`. É altamente recomendado anexar pelo menos um `notFoundComponent` ao route raiz ou configurar um `defaultNotFoundComponent` em nível de router para tratar erros de "não encontrado".

> ⚠️ Lançar um erro notFound em um método beforeLoad sempre vai acionar o notFoundComponent do \_\_root. Como os métodos beforeLoad são executados antes dos métodos loader do route, não há garantia de que os dados necessários para layouts tenham sido carregados com sucesso antes do erro ser lançado.

## Especificando Quais Routes Tratam Erros de "Não Encontrado"

Às vezes você pode querer acionar um "não encontrado" em um route pai específico e contornar a propagação normal do component de "não encontrado". Para fazer isso, passe um id de route para a opção `route` na função `notFound`.

```tsx
// _pathlessLayout.tsx
export const Route = createFileRoute("/_pathlessLayout")({
  // This will render
  notFoundComponent: () => {
    return <p>Not found (in _pathlessLayout)</p>;
  },
  component: () => {
    return (
      <div>
        <p>This is a pathless layout route!</p>
        <Outlet />
      </div>
    );
  },
});

// _pathlessLayout/route-a.tsx
export const Route = createFileRoute("/_pathless/route-a")({
  loader: async () => {
    // This will make LayoutRoute handle the not-found error
    throw notFound({ routeId: "/_pathlessLayout" });
    //                      ^^^^^^^^^ This will autocomplete from the registered router
  },
  // This WILL NOT render
  notFoundComponent: () => {
    return <p>Not found (in _pathlessLayout/route-a)</p>;
  },
});
```

### Direcionando manualmente o route raiz

Você também pode direcionar o route raiz passando a variável exportada `rootRouteId` para a propriedade `route` da função `notFound`:

```tsx
import { rootRouteId } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ params: { postId } }) => {
    const post = await getPost(postId);
    if (!post) throw notFound({ routeId: rootRouteId });
    return { post };
  },
});
```

### Lançando Erros de "Não Encontrado" em Components

Você também pode lançar erros de "não encontrado" em components. No entanto, **é recomendado lançar erros de "não encontrado" em métodos loader em vez de components para tipar corretamente os dados do loader e prevenir flickering.**

O TanStack Router expõe um component `CatchNotFound` similar ao `CatchBoundary` que pode ser usado para capturar erros de "não encontrado" em components e exibir a UI correspondente.

### Carregamento de Dados Dentro do `notFoundComponent`

`notFoundComponent` é um caso especial quando se trata de carregamento de dados. **`SomeRoute.useLoaderData` pode não estar definido dependendo de qual route você está tentando acessar e onde o erro de "não encontrado" é lançado**. No entanto, `Route.useParams`, `Route.useSearch`, `Route.useRouteContext`, etc. retornarão um valor definido.

**Se você precisa passar dados incompletos do loader para o `notFoundComponent`,** passe os dados pela opção `data` na função `notFound` e valide-os no `notFoundComponent`.

```tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ params: { postId } }) => {
    const post = await getPost(postId);
    if (!post)
      throw notFound({
        // Forward some data to the notFoundComponent
        // data: someIncompleteLoaderData
      });
    return { post };
  },
  // `data: unknown` is passed to the component via the `data` option when calling `notFound`
  notFoundComponent: ({ data }) => {
    // ❌ useLoaderData is not valid here: const { post } = Route.useLoaderData()

    // ✅:
    const { postId } = Route.useParams();
    const search = Route.useSearch();
    const context = Route.useRouteContext();

    return <p>Post with id {postId} not found!</p>;
  },
});
```

## Uso Com SSR

Veja o [guia de SSR](./ssr.md) para mais informações.

## Migrando do `NotFoundRoute`

A API `NotFoundRoute` está depreciada em favor de `notFoundComponent`. A API `NotFoundRoute` será removida em uma versão futura.

**A função `notFound` e o `notFoundComponent` não funcionarão ao usar `NotFoundRoute`.**

As principais diferenças são:

- `NotFoundRoute` é um route que requer um `<Outlet>` no seu route pai para renderizar. `notFoundComponent` é um component que pode ser anexado a qualquer route.
- Ao usar `NotFoundRoute`, você não pode usar layouts. `notFoundComponent` pode ser usado com layouts.
- Ao usar `notFoundComponent`, a correspondência de caminho é estrita. Isso significa que se você tem um route em `/post/$postId`, um erro de "não encontrado" será lançado se você tentar acessar `/post/1/2/3`. Com `NotFoundRoute`, `/post/1/2/3` corresponderia ao `NotFoundRoute` e só o renderizaria se houver um `<Outlet>`.

Para migrar do `NotFoundRoute` para o `notFoundComponent`, você só precisa fazer algumas alterações:

```tsx
// router.tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.'
- import { notFoundRoute } from './notFoundRoute'  // [!code --]

export const router = createRouter({
  routeTree,
- notFoundRoute // [!code --]
})

// routes/__root.tsx
import { createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  // ...
+ notFoundComponent: () => {  // [!code ++]
+   return <p>Not found!</p>  // [!code ++]
+ } // [!code ++]
})
```

Alterações importantes:

- Um `notFoundComponent` é adicionado ao route raiz para tratamento global de "não encontrado".
  - Você também pode adicionar um `notFoundComponent` a qualquer outro route na sua árvore de routes para tratar erros de "não encontrado" para aquele route específico.
- O `notFoundComponent` não suporta renderizar um `<Outlet>`.
