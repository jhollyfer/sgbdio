---
title: Devtools
---

> Link, pegue esta espada... quer dizer, Devtools!... para ajudá-lo na sua jornada!

Acene com as mãos no ar e comemore porque o TanStack Router vem com devtools dedicadas!

Quando você começar sua jornada com o TanStack Router, vai querer essas devtools ao seu lado. Elas ajudam a visualizar todo o funcionamento interno do TanStack Router e provavelmente vão te economizar horas de debugging se você se encontrar em apuros!

## Instalação

As devtools são um pacote separado que você precisa instalar:

```sh
npm install @tanstack/react-router-devtools
```

ou

```sh
pnpm add @tanstack/react-router-devtools
```

ou

```sh
yarn add @tanstack/react-router-devtools
```

ou

```sh
bun add @tanstack/react-router-devtools
```

## Importar as Devtools

```js
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
```

## Usando Devtools em produção

As Devtools, se importadas como `TanStackRouterDevtools`, não serão exibidas em produção. Se você quiser ter devtools em um ambiente com `process.env.NODE_ENV === 'production'`, use em vez disso `TanStackRouterDevtoolsInProd`, que tem todas as mesmas opções:

```tsx
import { TanStackRouterDevtoolsInProd } from "@tanstack/react-router-devtools";
```

## Usando dentro do `RouterProvider`

A maneira mais fácil para as devtools funcionarem é renderizá-las dentro do seu root route (ou qualquer outro route). Isso conectará automaticamente as devtools à instância do router.

```tsx
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const routeTree = rootRoute.addChildren([
  // ... other routes
]);

const router = createRouter({
  routeTree,
});

function App() {
  return <RouterProvider router={router} />;
}
```

## Passando a Instância do Router Manualmente

Se renderizar as devtools dentro do `RouterProvider` não é do seu agrado, uma prop `router` nas devtools aceita a mesma instância `router` que você passa ao component `Router`. Isso torna possível posicionar as devtools em qualquer lugar da página, não apenas dentro do provider:

```tsx
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
    </>
  );
}
```

## Modo Flutuante

O Modo Flutuante montará as devtools como um elemento fixo e flutuante na sua aplicação e fornecerá um botão no canto da tela para mostrar e ocultar as devtools. Esse estado do botão será armazenado e lembrado no localStorage entre recarregamentos.

Coloque o seguinte código o mais alto possível na sua aplicação React. Quanto mais próximo da raiz da página, melhor funcionará!

```js
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

function App() {
  return (
    <>
      <Router />
      <TanStackRouterDevtools initialIsOpen={false} />
    </>
  );
}
```

### Opções das Devtools

- `router: Router`
  - A instância do router para se conectar.
- `initialIsOpen: Boolean`
  - Defina como `true` se quiser que as devtools comecem abertas por padrão.
- `panelProps: PropsObject`
  - Use isto para adicionar props ao painel. Por exemplo, você pode adicionar `className`, `style` (mesclar e sobrescrever estilo padrão), etc.
- `closeButtonProps: PropsObject`
  - Use isto para adicionar props ao botão de fechar. Por exemplo, você pode adicionar `className`, `style` (mesclar e sobrescrever estilo padrão), `onClick` (estender o handler padrão), etc.
- `toggleButtonProps: PropsObject`
  - Use isto para adicionar props ao botão de alternância. Por exemplo, você pode adicionar `className`, `style` (mesclar e sobrescrever estilo padrão), `onClick` (estender o handler padrão), etc.
- `position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"`
  - O padrão é `bottom-left`.
  - A posição do logo do TanStack Router para abrir e fechar o painel das devtools.
- `shadowDOMTarget?: ShadowRoot`
  - Especifica um alvo de Shadow DOM para as devtools.
  - Por padrão, os estilos das devtools são aplicados à tag `<head>` do documento principal (light DOM). Quando um `shadowDOMTarget` é fornecido, os estilos serão aplicados dentro desse Shadow DOM em vez disso.
- `containerElement?: string | any`
  - Use isto para renderizar as devtools dentro de um tipo diferente de elemento container para fins de acessibilidade.
  - Qualquer string que corresponda a um elemento JSX intrínseco válido é permitida.
  - O padrão é 'footer'.

## Modo Fixo

Para controlar a posição das devtools, importe o `TanStackRouterDevtoolsPanel`:

```js
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
```

Ele pode então ser anexado a um alvo de Shadow DOM fornecido:

```js
<TanStackRouterDevtoolsPanel
  shadowDOMTarget={shadowContainer}
  router={router}
/>
```

Clique [aqui](https://tanstack.com/router/latest/docs/framework/react/examples/basic-devtools-panel) para ver um exemplo ao vivo disso no StackBlitz.

## Modo Embutido

O Modo Embutido incorporará as devtools como um component regular na sua aplicação. Você pode estilizá-lo como quiser depois disso!

```js
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

function App() {
  return (
    <>
      <Router router={router} />
      <TanStackRouterDevtoolsPanel
        router={router}
        style={styles}
        className={className}
      />
    </>
  );
}
```

### Opções do DevtoolsPanel

- `router: Router`
  - A instância do router para se conectar.
- `style: StyleObject`
  - O objeto de estilo React padrão usado para estilizar um component com estilos inline.
- `className: string`
  - A propriedade className padrão do React usada para estilizar um component com classes.
- `isOpen?: boolean`
  - Uma variável booleana indicando se o painel está aberto ou fechado.
- `setIsOpen?: (isOpen: boolean) => void`
  - Uma função que alterna o estado aberto e fechado do painel.
- `handleDragStart?: (e: any) => void`
  - Controla a abertura e o fechamento do painel das devtools.
- `shadowDOMTarget?: ShadowRoot`
  - Especifica um alvo de Shadow DOM para as devtools.
  - Por padrão, os estilos das devtools são aplicados à tag `<head>` do documento principal (light DOM). Quando um `shadowDOMTarget` é fornecido, os estilos serão aplicados dentro desse Shadow DOM em vez disso.
