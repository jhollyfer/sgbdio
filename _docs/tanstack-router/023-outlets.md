---
title: Outlets
---

Rotas aninhadas significam que routes podem ser aninhadas dentro de outras routes, incluindo a forma como elas são renderizadas. Então, como dizemos às nossas routes onde renderizar esse conteúdo aninhado?

## O Componente `Outlet`

O component `Outlet` é usado para renderizar a próxima route filha potencialmente correspondente. `<Outlet />` não recebe nenhuma prop e pode ser renderizado em qualquer lugar dentro da árvore de componentes de uma route. Se não houver route filha correspondente, `<Outlet />` renderizará `null`.

> [!TIP]
> Se o `component` de uma route for deixado como undefined, ele renderizará um `<Outlet />` automaticamente.

Um ótimo exemplo é configurar a route raiz da sua aplicação. Vamos dar à nossa route raiz um component que renderiza um título e, em seguida, um `<Outlet />` para que nossas routes de nível superior sejam renderizadas.

```tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div>
      <h1>My App</h1>
      <Outlet /> {/* This is where child routes will render */}
    </div>
  );
}
```
