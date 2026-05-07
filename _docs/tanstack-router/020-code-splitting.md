---
title: Code Splitting
---

Code splitting e lazy loading é uma técnica poderosa para melhorar o tamanho do bundle e a performance de carregamento de uma aplicação.

- Reduz a quantidade de código que precisa ser carregado no carregamento inicial da página
- O código é carregado sob demanda quando é necessário
- Resulta em mais chunks que são menores em tamanho e podem ser armazenados em cache mais facilmente pelo navegador.

## Como o TanStack Router faz code splitting?

O TanStack Router separa o código em duas categorias:

- **Configuração Crítica de Route** - O código que é necessário para renderizar a route atual e iniciar o processo de carregamento de dados o mais cedo possível.
  - Path Parsing/Serialization
  - Validação de Search Params
  - Loaders, Before Load
  - Route Context
  - Static Data
  - Links
  - Scripts
  - Styles
  - Toda outra configuração de route não listada abaixo

- **Configuração Não-Crítica/Lazy de Route** - O código que não é necessário para corresponder à route, e pode ser carregado sob demanda.
  - Route Component
  - Error Component
  - Pending Component
  - Not-found Component

> **Por que o loader não é separado?**
>
> - O loader já é uma fronteira assíncrona, então você paga dobrado para obter o chunk _e_ esperar o loader executar.
> - Categoricamente, é menos provável que ele contribua para um tamanho de bundle grande do que um component.
> - O loader é um dos assets preloadable mais importantes para uma route, especialmente se você está usando um intent de preload padrão, como passar o mouse sobre um link, então é importante que o loader esteja disponível sem nenhuma sobrecarga assíncrona adicional.
>
>   Sabendo as desvantagens de separar o loader, se você ainda quiser prosseguir com isso, vá para a seção [Data Loader Splitting](#data-loader-splitting).

## Encapsulando os arquivos de uma route em um diretório

Como o sistema de file-based routing do TanStack Router é projetado para suportar tanto estruturas de arquivo flat quanto aninhadas, é possível encapsular os arquivos de uma route em um único diretório sem nenhuma configuração adicional.

Para encapsular os arquivos de uma route em um diretório, mova o arquivo de route para um arquivo `.route` dentro de um diretório com o mesmo nome do arquivo de route.

Por exemplo, se você tem um arquivo de route chamado `posts.tsx`, você criaria um novo diretório chamado `posts` e moveria o arquivo `posts.tsx` para esse diretório, renomeando-o para `route.tsx`.

**Antes**

- `posts.tsx`

**Depois**

- `posts`
  - `route.tsx`

## Abordagens para code splitting

O TanStack Router suporta múltiplas abordagens para code splitting. Se você está usando code-based routing, pule para a seção [Code-Based Splitting](#code-based-splitting).

Quando você está usando file-based routing, pode usar as seguintes abordagens para code splitting:

- [Usando code-splitting automático](#using-automatic-code-splitting)
- [Usando o sufixo `.lazy.tsx`](#using-the-lazytsx-suffix)
- [Usando Virtual Routes](#using-virtual-routes)

## Usando code-splitting automático

Esta é a forma mais fácil e poderosa de fazer code splitting dos seus arquivos de route.

Ao usar o recurso `autoCodeSplitting`, o TanStack Router vai automaticamente fazer code splitting dos seus arquivos de route com base na configuração não-crítica de route mencionada acima.

> [!IMPORTANT]
> O recurso de code-splitting automático está disponível **APENAS** quando você está usando file-based routing com um dos nossos [bundlers suportados](../routing/file-based-routing.md#getting-started-with-file-based-routing).
> Isso **NÃO** vai funcionar se você estiver usando **apenas** o CLI (`@tanstack/router-cli`).

Para habilitar o code-splitting automático, você só precisa adicionar o seguinte à configuração do seu TanStack Router Bundler Plugin:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      // ...
      autoCodeSplitting: true,
    }),
    react(), // Make sure to add this plugin after the TanStack Router Bundler plugin
  ],
});
```

Pronto! O TanStack Router vai automaticamente fazer code-splitting de todos os seus arquivos de route pelas suas configurações críticas e não-críticas.

Se você quer mais controle sobre o processo de code-splitting, vá para o guia de [Automatic Code Splitting](./automatic-code-splitting.md) para saber mais sobre as opções disponíveis.

## Usando o sufixo `.lazy.tsx`

Se você não consegue usar o recurso de code-splitting automático, ainda pode fazer code-splitting dos seus arquivos de route usando o sufixo `.lazy.tsx`. É **tão fácil quanto mover seu código para um arquivo separado com o sufixo `.lazy.tsx`** e usar a função `createLazyFileRoute` em vez de `createFileRoute`.

> [!IMPORTANT]
> O arquivo de route `__root.tsx`, usando `createRootRoute` ou `createRootRouteWithContext`, não suporta code splitting, já que é sempre renderizado independentemente da route atual.

Estas são as únicas opções que `createLazyFileRoute` suporta:

| Nome do Export      | Descrição                                                                |
| ------------------- | ------------------------------------------------------------------------ |
| `component`         | O component a ser renderizado para a route.                              |
| `errorComponent`    | O component a ser renderizado quando ocorre um erro ao carregar a route. |
| `pendingComponent`  | O component a ser renderizado enquanto a route está carregando.          |
| `notFoundComponent` | O component a ser renderizado se um erro not-found for lançado.          |

### Exemplo de code splitting com `.lazy.tsx`

Quando você está usando `.lazy.tsx`, pode dividir sua route em dois arquivos para habilitar o code splitting:

**Antes (Arquivo Único)**

```tsx
// src/routes/posts.tsx
import { createFileRoute } from "@tanstack/react-router";
import { fetchPosts } from "./api";

export const Route = createFileRoute("/posts")({
  loader: fetchPosts,
  component: Posts,
});

function Posts() {
  // ...
}
```

**Depois (Dividido em dois arquivos)**

Este arquivo conteria a configuração crítica da route:

```tsx
// src/routes/posts.tsx

import { createFileRoute } from "@tanstack/react-router";
import { fetchPosts } from "./api";

export const Route = createFileRoute("/posts")({
  loader: fetchPosts,
});
```

Com a configuração não-crítica da route indo para o arquivo com o sufixo `.lazy.tsx`:

```tsx
// src/routes/posts.lazy.tsx
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/posts")({
  component: Posts,
});

function Posts() {
  // ...
}
```

## Usando Virtual Routes

Você pode se deparar com uma situação onde acaba separando tudo de um arquivo de route, deixando-o vazio! Nesse caso, simplesmente **delete o arquivo de route inteiramente**! Uma virtual route será automaticamente gerada para você para servir como âncora para seus arquivos code-split. Essa virtual route ficará diretamente no arquivo de route tree gerado.

**Antes (Virtual Routes)**

```tsx
// src/routes/posts.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  // Hello?
});
```

```tsx
// src/routes/posts.lazy.tsx
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/posts")({
  component: Posts,
});

function Posts() {
  // ...
}
```

**Depois (Virtual Routes)**

```tsx
// src/routes/posts.lazy.tsx
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/posts")({
  component: Posts,
});

function Posts() {
  // ...
}
```

Pronto!

## Code-Based Splitting

Se você está usando code-based routing, ainda pode fazer code-splitting das suas routes usando o método `Route.lazy()` e a função `createLazyRoute`. Você precisará dividir a configuração da sua route em duas partes:

Crie uma lazy route usando a função `createLazyRoute`.

```tsx
// src/posts.lazy.tsx
export const Route = createLazyRoute("/posts")({
  component: MyComponent,
});

function MyComponent() {
  return <div>My Component</div>;
}
```

Então, chame o método `.lazy` na definição da route no seu `app.tsx` para importar a lazy/code-split route com a configuração não-crítica da route.

```tsx
// src/app.tsx
const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts",
}).lazy(() => import("./posts.lazy").then((d) => d.Route));
```

## Data Loader Splitting

**Cuidado!!!** Separar um route loader é um jogo perigoso.

Pode ser uma ferramenta poderosa para reduzir o tamanho do bundle, mas tem um custo conforme mencionado na seção [Como o TanStack Router faz code splitting?](#how-does-tanstack-router-split-code).

Você pode fazer code splitting da sua lógica de carregamento de dados usando a opção `loader` da Route. Embora esse processo dificulte manter o type-safety com os parâmetros passados para o seu loader, você sempre pode usar o tipo genérico `LoaderContext` para chegar na maior parte do caminho:

```tsx
import { lazyFn } from "@tanstack/react-router";

const route = createRoute({
  path: "/my-route",
  component: MyComponent,
  loader: lazyFn(() => import("./loader"), "loader"),
});

// In another file...a
export const loader = async (context: LoaderContext) => {
  /// ...
};
```

Se você está usando file-based routing, só poderá separar seu `loader` se estiver usando [Automatic Code Splitting](#using-automatic-code-splitting) com opções de bundling personalizadas.

## Acessando manualmente APIs de Route em outros arquivos com o helper `getRouteApi`

Como você deve ter imaginado, colocar o código do seu component em um arquivo separado do da sua route pode dificultar o consumo da route em si. Para ajudar com isso, o TanStack Router exporta uma função prática `getRouteApi` que você pode usar para acessar as APIs type-safe de uma route em um arquivo sem importar a route em si.

- `my-route.tsx`

```tsx
import { createRoute } from "@tanstack/react-router";
import { MyComponent } from "./MyComponent";

const route = createRoute({
  path: "/my-route",
  loader: () => ({
    foo: "bar",
  }),
  component: MyComponent,
});
```

- `MyComponent.tsx`

```tsx
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/my-route");

export function MyComponent() {
  const loaderData = route.useLoaderData();
  //    ^? { foo: string }

  return <div>...</div>;
}
```

A função `getRouteApi` é útil para acessar outras APIs type-safe:

- `useLoaderData`
- `useLoaderDeps`
- `useMatch`
- `useParams`
- `useRouteContext`
- `useSearch`
