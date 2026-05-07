---
title: Manual Setup
---

Para configurar o TanStack Router manualmente em um projeto React, siga os passos abaixo. Isso oferece a configuração mínima necessária para começar com o TanStack Router usando tanto a geração de route baseada em arquivos quanto a configuração de route baseada em código:

## Usando Geração de Route Baseada em Arquivos

#### Instale o TanStack Router, o Plugin do Vite e os Devtools do Router

```sh
npm install @tanstack/react-router @tanstack/react-router-devtools
npm install -D @tanstack/router-plugin
# or
pnpm add @tanstack/react-router @tanstack/react-router-devtools
pnpm add -D @tanstack/router-plugin
# or
yarn add @tanstack/react-router @tanstack/react-router-devtools
yarn add -D @tanstack/router-plugin
# or
bun add @tanstack/react-router @tanstack/react-router-devtools
bun add -D @tanstack/router-plugin
# or
deno add npm:@tanstack/react-router npm:@tanstack/router-plugin npm:@tanstack/react-router-devtools
```

#### Configure o Plugin do Vite

```tsx
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    // ...,
  ],
});
```

> [!TIP]
> Se você não está usando o Vite, ou qualquer um dos bundlers suportados, confira o guia [TanStack Router CLI](./with-router-cli) para mais informações.

Crie os seguintes arquivos:

- `src/routes/__root.tsx` (com dois caracteres '`_`')
- `src/routes/index.tsx`
- `src/routes/about.tsx`
- `src/main.tsx`

#### `src/routes/__root.tsx`

```tsx
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
```

#### `src/routes/index.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
```

#### `src/routes/about.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return <div className="p-2">Hello from About!</div>;
}
```

#### `src/main.tsx`

Independentemente de você estar usando o pacote `@tanstack/router-plugin` e executando os scripts `npm run dev`/`npm run build`, ou executando manualmente os comandos `tsr watch`/`tsr generate` dos seus scripts do package, o arquivo da route tree será gerado em `src/routeTree.gen.ts`.

Importe a route tree gerada e crie uma nova instância do router:

```tsx
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
```

Se você está trabalhando com esse padrão, deve alterar o `id` da `<div>` raiz no seu arquivo `index.html` para `<div id='root'></div>`

## Usando Configuração de Route Baseada em Código

> [!IMPORTANT]
> O exemplo a seguir mostra como configurar routes usando código e, por questão de simplicidade, está em um único arquivo para esta demonstração. Embora a geração baseada em código permita declarar muitas routes e até a instância do router em um único arquivo, recomendamos dividir suas routes em arquivos separados para melhor organização e performance à medida que sua aplicação cresce.

```tsx
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    );
  },
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    return <div className="p-2">Hello from About!</div>;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
```

Se você passou por cima desses exemplos ou não entendeu algo, não te culpamos, porque há muito mais para aprender para realmente aproveitar o TanStack Router! Vamos seguir em frente.
