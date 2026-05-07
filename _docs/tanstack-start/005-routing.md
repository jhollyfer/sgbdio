---
id: routing
title: Routing
---

TanStack Start e construido sobre o TanStack Router, entao todos os recursos do TanStack Router estao disponiveis para voce.

> [!NOTE]
> Recomendamos fortemente ler a [documentacao do TanStack Router](/router/latest/docs/framework/react/overview) para aprender mais sobre os recursos e capacidades do TanStack Router. O que voce aprende aqui e mais uma visao geral de alto nivel do TanStack Router e como ele funciona no Start.

## O Router

O arquivo `router.tsx` e o arquivo que vai ditar o comportamento do TanStack Router usado dentro do Start. Ele esta localizado no diretorio `src` do seu projeto.

```
src/
├── router.tsx
```

Aqui, voce pode configurar tudo, desde a funcionalidade padrao de [preloading](/router/latest/docs/framework/react/guide/preloading) ate o [caching de dados obsoletos](/router/latest/docs/framework/react/guide/data-loading).

```tsx
// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// You must export a getRouter function that
// returns a new router instance each time
export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}
```

## Roteamento Baseado em Arquivos

O Start usa a abordagem de roteamento baseado em arquivos do TanStack Router para garantir code splitting adequado e type-safety avancada.

Voce pode encontrar suas rotas no diretorio `src/routes`.

```
src/
├── routes <-- Aqui e onde voce coloca suas rotas
│   ├── __root.tsx
│   ├── index.tsx
│   ├── about.tsx
│   ├── posts.tsx
│   ├── posts/$postId.tsx
```

## A Rota Raiz

A rota raiz e a rota mais alta em toda a arvore e encapsula todas as outras rotas como filhas. Ela esta no arquivo `src/routes/__root.tsx` e deve ser nomeada `__root.tsx`.

```
src/
├── routes
│   ├── __root.tsx <-- A rota raiz
```

- Nao possui caminho e e **sempre** correspondida
- Seu `component` e **sempre** renderizado
- E aqui que voce renderiza o shell do documento, por exemplo `<html>`, `<body>`, etc.
- Como e **sempre renderizado**, e o lugar perfeito para construir o shell da sua aplicacao e cuidar de qualquer logica global

```tsx
// src/routes/__root.tsx
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

Observe o component `Scripts` na parte inferior da tag `<body>`. Ele e usado para carregar todo o JavaScript do lado do cliente para a aplicacao e deve sempre ser incluido para o funcionamento adequado.

## O Component HeadContent

O component `HeadContent` e usado para renderizar as tags head, title, meta, link e tags de script relacionadas ao head do documento.

Ele deve ser **renderizado na tag `<head>` do layout da sua rota raiz.**

## O Component Outlet

O component `Outlet` e usado para renderizar a proxima rota filha potencialmente correspondente. `<Outlet />` nao recebe nenhuma props e pode ser renderizado em qualquer lugar na arvore de components de uma rota. Se nao houver rota filha correspondente, `<Outlet />` vai renderizar `null`.

## O Component Scripts

O component `Scripts` e usado para renderizar os scripts do body do documento.

Ele deve ser **renderizado na tag `<body>` do layout da sua rota raiz.**

## Geracao da Arvore de Rotas

Voce pode notar um arquivo `routeTree.gen.ts` no seu projeto.

```
src/
├── routeTree.gen.ts <-- O arquivo de arvore de rotas gerado
```

Este arquivo e gerado automaticamente quando voce executa o TanStack Start (via `npm run dev` ou `npm run start`). Este arquivo contem a arvore de rotas gerada e algumas utilidades TypeScript que tornam a type-safety do TanStack Start extremamente rapida e totalmente inferida.

## Rotas Aninhadas

O TanStack Router usa rotas aninhadas para corresponder a URL com a arvore de components correta a ser renderizada.

Por exemplo, dadas as seguintes rotas:

```
routes/
├── __root.tsx <-- Renderiza o component <Root>
├── posts.tsx <-- Renderiza o component <Posts>
├── posts.$postId.tsx <-- Renderiza o component <Post>
```

E a URL: `/posts/123`

A arvore de components ficaria assim:

```
<Root>
  <Posts>
    <Post />
  </Posts>
</Root>
```

## Tipos de Rotas

Existem alguns tipos diferentes de rotas que voce pode criar no seu projeto.

- Rotas de Indice - Correspondidas quando a URL e exatamente igual ao caminho da rota
- Rotas Dinamicas/Wildcard/Splat - Capturam dinamicamente parte ou toda a URL em uma variavel para usar na sua aplicacao

Tambem existem alguns tipos de rotas utilitarias que voce pode usar para agrupar e organizar suas rotas

- Rotas de Layout sem Caminho (Aplicam layout ou logica a um grupo de rotas sem aninha-las em um caminho)
- Rotas Nao Aninhadas (Desaninham uma rota de seus pais e renderizam sua propria arvore de components)
- Rotas Agrupadas (Agrupam rotas em um diretorio simplesmente para organizacao, sem afetar a hierarquia de caminhos)

## Configuracao da Arvore de Rotas

A arvore de rotas e configurada no diretorio `src/routes`.

## Criando Rotas de Arquivo

Para criar uma rota, crie um novo arquivo que corresponda ao caminho da rota que voce deseja criar. Por exemplo:

| Caminho          | Nome do Arquivo     | Tipo              |
| ---------------- | ------------------- | ----------------- |
| `/`              | `index.tsx`         | Rota de Indice    |
| `/about`         | `about.tsx`         | Rota Estatica     |
|                  | `posts.tsx`         | Rota de "Layout"  |
| `/posts/`        | `posts/index.tsx`   | Rota de Indice    |
| `/posts/:postId` | `posts/$postId.tsx` | Rota Dinamica     |
| `/rest/*`        | `rest/$.tsx`        | Rota Wildcard     |

## Definindo Rotas

Para definir uma rota, use a funcao `createFileRoute` para exportar a rota como a variavel `Route`.

Por exemplo, para lidar com a rota `/posts/:postId`, voce criaria um arquivo chamado `posts/$postId.tsx` aqui:

```
src/
├── routes
│   ├── posts/$postId.tsx
```

Depois, defina a rota assim:

```tsx
// src/routes/posts/$postId.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  component: PostComponent,
});
```

> [!NOTE]
> A string de caminho passada para `createFileRoute` e **escrita e gerenciada automaticamente pelo router para voce atraves do Plugin de Bundler do TanStack Router ou da CLI do Router.** Entao, conforme voce cria novas rotas, move rotas ou renomeia rotas, o caminho sera atualizado automaticamente para voce.

## Isso e apenas o "start"

Esta foi apenas uma visao geral de alto nivel de como configurar rotas usando o TanStack Router. Para informacoes mais detalhadas, consulte a [documentacao do TanStack Router](/router/latest/docs/framework/react/routing/file-based-routing).
