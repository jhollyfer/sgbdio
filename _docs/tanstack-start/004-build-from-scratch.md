---
id: build-from-scratch
title: Build a Project from Scratch
---

> [!NOTE]
> Se voce escolheu fazer o quick start com um exemplo ou projeto clonado, pode pular este guia e seguir para o guia de [Routing](./guide/routing).

_Entao voce quer construir um projeto TanStack Start do zero?_

Este guia vai ajudar voce a construir uma aplicacao web TanStack Start **muito** basica. Juntos, vamos usar o TanStack Start para:

- Servir uma pagina inicial
- Exibir um contador
- Incrementar o contador no servidor e no cliente

[Veja como ficara o resultado](https://stackblitz.com/github/tanstack/router/tree/main/examples/react/start-counter)

Vamos criar um novo diretorio de projeto e inicializa-lo.

```shell
mkdir myApp
cd myApp
npm init -y
```

> [!NOTE]
> Usamos `npm` em todos esses exemplos, mas voce pode usar o gerenciador de pacotes de sua preferencia.

## Configuracao do TypeScript

Recomendamos fortemente usar TypeScript com o TanStack Start. Crie um arquivo `tsconfig.json` com pelo menos as seguintes configuracoes:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true
  }
}
```

> [!NOTE]
> Habilitar `verbatimModuleSyntax` pode resultar em bundles do servidor vazando para bundles do cliente. E recomendado manter essa opcao desabilitada.

## Instalar Dependencias

TanStack Start e alimentado pelo [Vite](https://vite.dev/) e [TanStack Router](https://tanstack.com/router) e os requer como dependencias.

Para instala-los, execute:

```shell
npm i @tanstack/react-start @tanstack/react-router
```

Tambem precisamos do vite como devDependency:

```shell
npm i -D vite
```

Voce tambem vai precisar do React:

```shell
npm i react react-dom
```

Assim como o plugin do React para Vite:

```shell
npm i -D @vitejs/plugin-react
```

Alternativamente, voce tambem pode usar `@vitejs/plugin-react-oxc` ou `@vitejs/plugin-react-swc`.

E um pouco de TypeScript:

```shell
npm i -D typescript @types/react @types/react-dom @types/node vite-tsconfig-paths
```

## Atualizar Arquivos de Configuracao

Em seguida, vamos atualizar nosso `package.json` para usar a CLI do Vite e definir `"type": "module"`:

```json
{
  // ...
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
```

Depois configure o plugin Vite do TanStack Start em `vite.config.ts`:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
});
```

## Adicionar o Template Basico

Existem 2 arquivos obrigatorios para o uso do TanStack Start:

1. A configuracao do router
2. A raiz da sua aplicacao

Quando a configuracao estiver concluida, teremos uma arvore de arquivos parecida com a seguinte:

```
.
├── src/
│   ├── routes/
│   │   └── `__root.tsx`
│   ├── `router.tsx`
│   ├── `routeTree.gen.ts`
├── `vite.config.ts`
├── `package.json`
└── `tsconfig.json`
```

## A Configuracao do Router

Este e o arquivo que vai ditar o comportamento do TanStack Router usado dentro do Start. Aqui, voce pode configurar tudo, desde a funcionalidade padrao de [preloading](/router/latest/docs/framework/react/guide/preloading) ate o [caching de dados obsoletos](/router/latest/docs/framework/react/guide/data-loading).

> [!NOTE]
> Voce ainda nao tera um arquivo `routeTree.gen.ts`. Este arquivo sera gerado quando voce executar o TanStack Start pela primeira vez.

```tsx
// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}
```

## A Raiz da Sua Aplicacao

Por fim, precisamos criar a raiz da nossa aplicacao. Este e o ponto de entrada para todas as outras rotas. O codigo neste arquivo vai envolver todas as outras rotas da aplicacao.

```tsx
// src/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

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

## Escrevendo Sua Primeira Rota

Agora que temos o template basico configurado, podemos escrever nossa primeira rota. Isso e feito criando um novo arquivo no diretorio `src/routes`.

```tsx
// src/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
  );
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .inputValidator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <button
      type="button"
      onClick={() => {
        updateCount({ data: 1 }).then(() => {
          router.invalidate();
        });
      }}
    >
      Add 1 to {state}?
    </button>
  );
}
```

E isso! Voce agora configurou um projeto TanStack Start e escreveu sua primeira rota.

Agora voce pode executar `npm run dev` para iniciar seu servidor e navegar ate `http://localhost:3000` para ver sua rota em acao.

Quer fazer deploy da sua aplicacao? Confira o [guia de hospedagem](./guide/hosting.md).
