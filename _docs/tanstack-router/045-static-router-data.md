---
title: Static Route Data
---

Ao criar routes, você pode opcionalmente especificar uma propriedade `staticData` nas opções da route. Esse objeto pode conter literalmente qualquer coisa que você quiser, desde que esteja sincronamente disponível quando você criar sua route.

Além de poder acessar esses dados a partir da própria route, você também pode acessá-los a partir de qualquer match sob a propriedade `match.staticData`.

## Exemplo

- `posts.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  staticData: {
    customData: "Hello!",
  },
});
```

Você pode então acessar esses dados em qualquer lugar que tenha acesso às suas routes, incluindo matches que podem ser mapeados de volta para suas routes.

- `__root.tsx`

```tsx
import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => {
    const matches = useMatches();

    return (
      <div>
        {matches.map((match) => {
          return <div key={match.id}>{match.staticData.customData}</div>;
        })}
      </div>
    );
  },
});
```

## Impondo Dados Estáticos

Se você quiser impor que uma route tenha dados estáticos, pode usar declaração de mesclagem (declaration merging) para adicionar um tipo à opção estática da route:

```tsx
declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    customData: string;
  }
}
```

Agora, se você tentar criar uma route sem a propriedade `customData`, receberá um erro de tipo:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  staticData: {
    // Property 'customData' is missing in type '{ customData: number; }' but required in type 'StaticDataRouteOption'.ts(2741)
  },
});
```

## Dados Estáticos Opcionais

Se você quiser tornar os dados estáticos opcionais, simplesmente adicione um `?` à propriedade:

```tsx
declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    customData?: string;
  }
}
```

Desde que haja quaisquer propriedades obrigatórias no `StaticDataRouteOption`, você será obrigado a passar um objeto.

## Padrões Comuns

### Controlando a Visibilidade do Layout

Use staticData para controlar quais routes mostram ou ocultam elementos de layout:

```tsx
// routes/admin/route.tsx
export const Route = createFileRoute("/admin")({
  staticData: { showNavbar: false },
  component: AdminLayout,
});
```

```tsx
// routes/__root.tsx
function RootComponent() {
  const showNavbar = useMatches({
    select: (matches) =>
      !matches.some((m) => m.staticData?.showNavbar === false),
  });

  return showNavbar ? (
    <Navbar>
      <Outlet />
    </Navbar>
  ) : (
    <Outlet />
  );
}
```

### Títulos de Route para Breadcrumbs

```tsx
// routes/posts/$postId.tsx
export const Route = createFileRoute("/posts/$postId")({
  staticData: {
    getTitle: () => "Post Details",
  },
});
```

```tsx
// In a Breadcrumb component
function Breadcrumbs() {
  const matches = useMatches();

  return (
    <nav>
      {matches
        .filter((m) => m.staticData?.getTitle)
        .map((m) => (
          <span key={m.id}>{m.staticData.getTitle()}</span>
        ))}
    </nav>
  );
}
```

### Quando Usar staticData vs Context

| staticData                                      | context                                |
| ----------------------------------------------- | -------------------------------------- |
| Síncrono, definido na criação da route           | Pode ser async (via `beforeLoad`)      |
| Disponível antes do carregamento iniciar         | Pode depender de params/search         |
| Igual para todas as instâncias de uma route      | Passado para routes filhas             |

Use staticData para metadados estáticos de route. Use context para dados dinâmicos ou state de autenticação que varia por requisição.
