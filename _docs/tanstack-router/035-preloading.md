---
title: Preloading
---

O preloading no TanStack Router é uma forma de carregar uma route antes que o usuário realmente navegue até ela. Isso é útil para routes que provavelmente serão visitadas pelo usuário em seguida. Por exemplo, se você tem uma lista de posts e o usuário provavelmente clicará em um deles, você pode fazer o preload da route do post para que esteja pronta quando o usuário clicar.

## Estratégias de Preloading Suportadas

- Intenção
  - O preloading por **"intent"** funciona usando eventos de hover e touch start nos components `<Link>` para pré-carregar as dependências da route de destino.
  - Essa estratégia é útil para pré-carregar routes que o usuário provavelmente visitará em seguida.
- Visibilidade na Viewport
  - O preloading por **"viewport"** funciona usando a API Intersection Observer para pré-carregar as dependências da route de destino quando o component `<Link>` está na viewport.
  - Essa estratégia é útil para pré-carregar routes que estão abaixo da dobra ou fora da tela.
- Render
  - O preloading por **"render"** funciona pré-carregando as dependências da route de destino assim que o component `<Link>` é renderizado no DOM.
  - Essa estratégia é útil para pré-carregar routes que são sempre necessárias.

## Por quanto tempo os dados pré-carregados ficam na memória?

Os matches de route pré-carregados são temporariamente armazenados em cache na memória com algumas ressalvas importantes:

- **Dados pré-carregados não utilizados são removidos após 30 segundos por padrão.** Isso pode ser configurado definindo a opção `defaultPreloadMaxAge` no seu router.
- **Obviamente, quando uma route é carregada, sua versão pré-carregada é promovida para o state normal de matches pendentes do router.**

Se você precisa de mais controle sobre preloading, caching e/ou garbage collection de dados pré-carregados, deve usar uma biblioteca externa de caching como o [TanStack Query](https://tanstack.com/query).

A forma mais simples de pré-carregar routes para sua aplicação é definir a opção `defaultPreload` como `intent` para todo o seu router:

```tsx
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  // ...
  defaultPreload: "intent",
});
```

Isso ativará o preloading por `intent` por padrão para todos os components `<Link>` na sua aplicação. Você também pode definir a prop `preload` em components `<Link>` individuais para sobrescrever o comportamento padrão.

## Atraso do Preload

Por padrão, o preloading começará após **50ms** do usuário passar o mouse ou tocar em um component `<Link>`. Você pode alterar esse atraso definindo a opção `defaultPreloadDelay` no seu router:

```tsx
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  // ...
  defaultPreloadDelay: 100,
});
```

Você também pode definir a prop `preloadDelay` em components `<Link>` individuais para sobrescrever o comportamento padrão por link.

## Preloading Integrado & `preloadStaleTime`

Se você estiver usando os loaders integrados, pode controlar por quanto tempo os dados pré-carregados são considerados fresh até que outro preload seja acionado, definindo `routerOptions.defaultPreloadStaleTime` ou `routeOptions.preloadStaleTime` para um número de milissegundos. **Por padrão, dados pré-carregados são considerados fresh por 30 segundos.**

Para alterar isso, você pode definir a opção `defaultPreloadStaleTime` no seu router:

```tsx
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  // ...
  defaultPreloadStaleTime: 10_000,
});
```

Ou, você pode usar a opção `routeOptions.preloadStaleTime` em routes individuais:

```tsx
// src/routes/posts.$postId.tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ params }) => fetchPost(params.postId),
  // Preload the route again if the preload cache is older than 10 seconds
  preloadStaleTime: 10_000,
});
```

## Preloading com Bibliotecas Externas

Ao integrar bibliotecas de caching externas como React Query, que possuem seus próprios mecanismos para determinar dados stale, você pode querer sobrescrever a lógica padrão de preloading e stale-while-revalidate do TanStack Router. Essas bibliotecas frequentemente usam opções como staleTime para controlar a validade dos dados.

Para personalizar o comportamento de preloading no TanStack Router e aproveitar totalmente a estratégia de caching da sua biblioteca externa, você pode ignorar o caching integrado definindo `routerOptions.defaultPreloadStaleTime` ou `routeOptions.preloadStaleTime` como 0. Isso garante que todos os preloads sejam marcados como stale internamente, e os loaders sejam sempre invocados, permitindo que sua biblioteca externa, como React Query, gerencie o carregamento e caching de dados.

Por exemplo:

```tsx
import { createRouter } from "@tanstack/react-router";

const router = createRouter({
  // ...
  defaultPreloadStaleTime: 0,
});
```

Isso permitiria então que você, por exemplo, use uma opção como o `staleTime` do React Query para controlar a validade dos seus preloads.

## Preloading Manual

Se você precisa fazer o preload de uma route manualmente, pode usar o método `preloadRoute` do router. Ele aceita um objeto `NavigateOptions` padrão do TanStack e retorna uma promise que resolve quando a route é pré-carregada.

```tsx
function Component() {
  const router = useRouter();

  useEffect(() => {
    async function preload() {
      try {
        const matches = await router.preloadRoute({
          to: postRoute,
          params: { id: 1 },
        });
      } catch (err) {
        // Failed to preload route
      }
    }

    preload();
  }, [router]);

  return <div />;
}
```

Se você precisa pré-carregar apenas o chunk JS de uma route, pode usar o método `loadRouteChunk` do router. Ele aceita um objeto de route e retorna uma promise que resolve quando o chunk da route é carregado.

```tsx
function Component() {
  const router = useRouter();

  useEffect(() => {
    async function preloadRouteChunks() {
      try {
        const postsRoute = router.routesByPath["/posts"];
        await Promise.all([
          router.loadRouteChunk(router.routesByPath["/"]),
          router.loadRouteChunk(postsRoute),
          router.loadRouteChunk(postsRoute.parentRoute),
        ]);
      } catch (err) {
        // Failed to preload route chunk
      }
    }

    preloadRouteChunks();
  }, [router]);

  return <div />;
}
```
