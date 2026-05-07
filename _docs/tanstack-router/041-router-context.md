---
title: Router Context
---

O router context do TanStack Router é uma ferramenta muito poderosa que pode ser usada para injeção de dependências, entre muitas outras coisas. Como o nome sugere, o router context é passado através do router e para baixo através de cada route correspondente. Em cada route na hierarquia, o context pode ser modificado ou acrescido. Aqui estão algumas maneiras práticas de usar o router context:

- Injeção de Dependências
  - Você pode fornecer dependências (por exemplo, uma função de loader, um client de data fetching, um serviço de mutation) que a route e todas as routes filhas podem acessar e usar sem importar ou criar diretamente.
- Breadcrumbs
  - Embora o objeto de context principal de cada route seja mesclado conforme desce na hierarquia, o context único de cada route também é armazenado, tornando possível anexar breadcrumbs ou métodos ao context de cada route.
- Gerenciamento dinâmico de meta tags
  - Você pode anexar meta tags ao context de cada route e depois usar um gerenciador de meta tags para atualizar dinamicamente as meta tags na página conforme o usuário navega pelo site.

Esses são apenas usos sugeridos do router context. Você pode usá-lo para o que quiser!

## Router Context Tipado

Assim como tudo o mais, o router context raiz é estritamente tipado. Esse tipo pode ser ampliado pela opção `beforeLoad` de qualquer route conforme é mesclado na árvore de route matches. Para restringir o tipo do router context raiz, você deve usar a função `createRootRouteWithContext<YourContextTypeHere>()(routeOptions)` para criar um novo router context em vez da função `createRootRoute()` para criar sua route raiz. Aqui está um exemplo:

```tsx
import {
  createRootRouteWithContext,
  createRouter,
} from "@tanstack/react-router";

interface MyRouterContext {
  user: User;
}

// Use the routerContext to create your root route
const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: App,
});

const routeTree = rootRoute.addChildren([
  // ...
]);

// Use the routerContext to create your router
const router = createRouter({
  routeTree,
});
```

> [!TIP]
> `MyRouterContext` só precisa conter o conteúdo que será passado diretamente para o `createRouter` abaixo. Todo o context adicional adicionado em `beforeLoad` será inferido.

## Passando o Router Context Inicial

O router context é passado para o router no momento da instanciação. Você pode passar o router context inicial para o router através da opção `context`:

> [!TIP]
> Se o seu context tiver alguma propriedade obrigatória, você verá um erro do TypeScript se não passá-la no router context inicial. Se todas as propriedades do seu context forem opcionais, você não verá um erro do TypeScript e passar o context será opcional. Se você não passar um router context, ele será `{}` por padrão.

```tsx
import { createRouter } from "@tanstack/react-router";

// Use the routerContext you created to create your router
const router = createRouter({
  routeTree,
  context: {
    user: {
      id: "123",
      name: "John Doe",
    },
  },
});
```

### Invalidando o Router Context

Se você precisar invalidar o state do context que está passando para o router, pode chamar o método `invalidate` para dizer ao router para recalcular o context. Isso é útil quando você precisa atualizar o state do context e fazer com que o router recalcule o context para todas as routes.

```tsx
function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      router.invalidate();
    });

    return unsubscribe;
  }, []);

  return user;
}
```

## Usando o Router Context

Uma vez que você tenha definido o tipo do router context, pode usá-lo nas definições das suas routes:

```tsx
// src/routes/todos.tsx
export const Route = createFileRoute("/todos")({
  component: Todos,
  loader: ({ context }) => fetchTodosByUserId(context.user.id),
});
```

Você pode até injetar implementações de data fetching e mutations! Na verdade, isso é altamente recomendado.

Vamos tentar isso com uma função simples para buscar alguns todos:

```tsx
const fetchTodosByUserId = async ({ userId }) => {
  const response = await fetch(`/api/todos?userId=${userId}`);
  const data = await response.json();
  return data;
};

const router = createRouter({
  routeTree: rootRoute,
  context: {
    userId: "123",
    fetchTodosByUserId,
  },
});
```

Depois, na sua route:

```tsx
// src/routes/todos.tsx
export const Route = createFileRoute("/todos")({
  component: Todos,
  loader: ({ context }) => context.fetchTodosByUserId(context.userId),
});
```

### E quanto a uma biblioteca de data fetching externa?

```tsx
import {
  createRootRouteWithContext,
  createRouter,
} from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: App,
});

const queryClient = new QueryClient();

const router = createRouter({
  routeTree: rootRoute,
  context: {
    queryClient,
  },
});
```

Depois, na sua route:

```tsx
// src/routes/todos.tsx
export const Route = createFileRoute("/todos")({
  component: Todos,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["todos", { userId: user.id }],
      queryFn: fetchTodos,
    });
  },
});
```

## E quanto ao uso de React Context/Hooks?

Ao tentar usar React Context ou Hooks nas funções `beforeLoad` ou `loader` da sua route, é importante lembrar as [Regras dos Hooks](https://react.dev/reference/rules/rules-of-hooks) do React. Você não pode usar hooks em uma função que não seja do React, então não pode usar hooks nas suas funções `beforeLoad` ou `loader`.

Então, como usamos React Context ou Hooks nas funções `beforeLoad` ou `loader` da nossa route? Podemos usar o router context para passar o React Context ou Hooks para as funções `beforeLoad` ou `loader` da nossa route.

Vamos ver a configuração de um exemplo, onde passamos um hook `useNetworkStrength` para a função `loader` da nossa route:

- `src/routes/__root.tsx`

```tsx
// First, make sure the context for the root route is typed
import { createRootRouteWithContext } from "@tanstack/react-router";
import { useNetworkStrength } from "@/hooks/useNetworkStrength";

interface MyRouterContext {
  networkStrength: ReturnType<typeof useNetworkStrength>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: App,
});
```

Neste exemplo, instanciaríamos o hook antes de renderizar o router usando o `<RouterProvider />`. Dessa forma, o hook seria chamado no "território do React", aderindo assim às Regras dos Hooks.

- `src/router.tsx`

```tsx
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  context: {
    networkStrength: undefined!, // We'll set this in React-land
  },
});
```

- `src/main.tsx`

```tsx
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

import { useNetworkStrength } from "@/hooks/useNetworkStrength";

function App() {
  const networkStrength = useNetworkStrength();
  // Inject the returned value from the hook into the router context
  return <RouterProvider router={router} context={{ networkStrength }} />;
}

// ...
```

Então, agora na função `loader` da nossa route, podemos acessar o hook `useNetworkStrength` a partir do router context:

- `src/routes/posts.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  component: Posts,
  loader: ({ context }) => {
    if (context.networkStrength === "STRONG") {
      // Do something
    }
  },
});
```

## Modificando o Router Context

O router context é passado para baixo na árvore de routes e é mesclado em cada route. Isso significa que você pode modificar o context em cada route e as modificações estarão disponíveis para todas as routes filhas. Aqui está um exemplo:

- `src/routes/__root.tsx`

```tsx
import { createRootRouteWithContext } from "@tanstack/react-router";

interface MyRouterContext {
  foo: boolean;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: App,
});
```

- `src/router.tsx`

```tsx
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: {
    foo: true,
  },
});
```

- `src/routes/todos.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/todos")({
  component: Todos,
  beforeLoad: () => {
    return {
      bar: true,
    };
  },
  loader: ({ context }) => {
    context.foo; // true
    context.bar; // true
  },
});
```

## Processando o Router Context Acumulado

O context, especialmente os objetos de `context` isolados de cada route, tornam trivial acumular e processar os objetos de context de todas as routes correspondentes. Aqui está um exemplo onde usamos todos os contexts das routes correspondentes para gerar uma trilha de breadcrumbs:

```tsx
// src/routes/__root.tsx
export const Route = createRootRoute({
  component: () => {
    const matches = useRouterState({ select: (s) => s.matches });

    const breadcrumbs = matches
      .filter((match) => match.context.getTitle)
      .map(({ pathname, context }) => {
        return {
          title: context.getTitle(),
          path: pathname,
        };
      });

    // ...
  },
});
```

Usando esse mesmo router context, também poderíamos gerar uma tag de título para o `<head>` da nossa página:

```tsx
// src/routes/__root.tsx
export const Route = createRootRoute({
  component: () => {
    const matches = useRouterState({ select: (s) => s.matches });

    const matchWithTitle = [...matches]
      .reverse()
      .find((d) => d.context.getTitle);

    const title = matchWithTitle?.context.getTitle() || "My App";

    return (
      <html>
        <head>
          <title>{title}</title>
        </head>
        <body>{/* ... */}</body>
      </html>
    );
  },
});
```
