---
id: virtual-file-routes
title: Virtual File Routes
---

> Gostaríamos de agradecer à equipe do Remix por [pioneirar o conceito de virtual file routes](https://www.youtube.com/watch?v=fjTX8hQTlEc&t=730s). Nos inspiramos no trabalho deles e adaptamos para funcionar com a geração de árvore de routes baseada em arquivos já existente do TanStack Router.

Virtual file routes são um conceito poderoso que permite construir uma árvore de routes programaticamente usando código que referencia arquivos reais no seu projeto. Isso pode ser útil se:

- Você tem uma organização de routes existente que deseja manter.
- Você quer personalizar a localização dos seus arquivos de route.
- Você quer substituir completamente a geração de routes baseada em arquivos do TanStack Router e construir sua própria convenção.

Aqui está um exemplo rápido de uso de virtual file routes para mapear uma árvore de routes para um conjunto de arquivos reais no seu projeto:

```tsx
// routes.ts
import {
  rootRoute,
  route,
  index,
  layout,
  physical,
} from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  index("index.tsx"),
  layout("pathlessLayout.tsx", [
    route("/dashboard", "app/dashboard.tsx", [
      index("app/dashboard-index.tsx"),
      route("/invoices", "app/dashboard-invoices.tsx", [
        index("app/invoices-index.tsx"),
        route("$id", "app/invoice-detail.tsx"),
      ]),
    ]),
    physical("/posts", "posts"),
  ]),
]);
```

## Configuração

Virtual file routes podem ser configuradas via:

- O plugin `TanStackRouter` para Vite/Rspack/Webpack
- O arquivo `tsr.config.json` para o TanStack Router CLI

## Configuração via Plugin TanStackRouter

Se você está usando o plugin `TanStackRouter` para Vite/Rspack/Webpack, pode configurar virtual file routes passando o caminho do seu arquivo de routes para a opção `virtualRoutesConfig` ao configurar o plugin:

```tsx
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      virtualRouteConfig: "./routes.ts",
    }),
    react(),
  ],
});
```

Ou você pode escolher definir as virtual routes diretamente na configuração:

```tsx
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { rootRoute } from "@tanstack/virtual-file-routes";

const routes = rootRoute("root.tsx", [
  // ... the rest of your virtual route tree
]);

export default defineConfig({
  plugins: [tanstackRouter({ virtualRouteConfig: routes }), react()],
});
```

## Criando Virtual File Routes

Para criar virtual file routes, você precisará importar o pacote `@tanstack/virtual-file-routes`. Esse pacote fornece um conjunto de funções que permitem criar virtual routes que referenciam arquivos reais no seu projeto. Algumas funções utilitárias são exportadas do pacote:

- `rootRoute` - Cria uma virtual root route.
- `route` - Cria uma virtual route.
- `index` - Cria uma virtual index route.
- `layout` - Cria uma virtual pathless layout route.
- `physical` - Cria uma virtual route física (mais sobre isso adiante).

## Virtual Root Route

A função `rootRoute` é usada para criar uma virtual root route. Ela recebe um nome de arquivo e um array de routes filhas. Aqui está um exemplo de uma virtual root route:

```tsx
// routes.ts
import { rootRoute } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  // ... children routes
]);
```

## Virtual Route

A função `route` é usada para criar uma virtual route. Ela recebe um caminho, um nome de arquivo e um array de routes filhas. Aqui está um exemplo de uma virtual route:

```tsx
// routes.ts
import { route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  route("/about", "about.tsx", [
    // ... children routes
  ]),
]);
```

Você também pode definir uma virtual route sem um nome de arquivo. Isso permite definir um prefixo de caminho comum para suas filhas:

```tsx
// routes.ts
import { route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  route("/hello", [
    route("/world", "world.tsx"), // full path will be "/hello/world"
    route("/universe", "universe.tsx"), // full path will be "/hello/universe"
  ]),
]);
```

## Virtual Index Route

A função `index` é usada para criar uma virtual index route. Ela recebe um nome de arquivo. Aqui está um exemplo de uma virtual index route:

```tsx
import { index } from "@tanstack/virtual-file-routes";

const routes = rootRoute("root.tsx", [index("index.tsx")]);
```

## Virtual Pathless Route

A função `layout` é usada para criar uma virtual pathless route. Ela recebe um nome de arquivo, um array de routes filhas e um ID pathless opcional. Aqui está um exemplo de uma virtual pathless route:

```tsx
// routes.ts
import { layout } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  layout("pathlessLayout.tsx", [
    // ... children routes
  ]),
]);
```

Você também pode especificar um ID pathless para dar à route um identificador único diferente do nome do arquivo:

```tsx
// routes.ts
import { layout } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  layout("my-pathless-layout-id", "pathlessLayout.tsx", [
    // ... children routes
  ]),
]);
```

## Physical Virtual Routes

Physical virtual routes são uma forma de "montar" um diretório com a boa e velha convenção de roteamento baseado em arquivos do TanStack Router sob um caminho de URL específico. Isso pode ser útil se você está usando virtual routes para personalizar uma pequena parte da sua árvore de routes no topo da hierarquia, mas quer usar a convenção padrão de roteamento baseado em arquivos para sub-routes e diretórios.

Considere a seguinte estrutura de arquivos:

```
/routes
├── root.tsx
├── index.tsx
├── pathlessLayout.tsx
├── app
│   ├── dashboard.tsx
│   ├── dashboard-index.tsx
│   ├── dashboard-invoices.tsx
│   ├── invoices-index.tsx
│   ├── invoice-detail.tsx
└── posts
    ├── index.tsx
    ├── $postId.tsx
    ├── $postId.edit.tsx
    ├── comments/
    │   ├── index.tsx
    │   ├── $commentId.tsx
    └── likes/
        ├── index.tsx
        ├── $likeId.tsx
```

Vamos usar virtual routes para personalizar nossa árvore de routes para tudo exceto `posts`, e então usar physical virtual routes para montar o diretório `posts` sob o caminho `/posts`:

```tsx
// routes.ts
export const routes = rootRoute("root.tsx", [
  // Set up your virtual routes as normal
  index("index.tsx"),
  layout("pathlessLayout.tsx", [
    route("/dashboard", "app/dashboard.tsx", [
      index("app/dashboard-index.tsx"),
      route("/invoices", "app/dashboard-invoices.tsx", [
        index("app/invoices-index.tsx"),
        route("$id", "app/invoice-detail.tsx"),
      ]),
    ]),
    // Mount the `posts` directory under the `/posts` path
    physical("/posts", "posts"),
  ]),
]);
```

### Mesclando Routes Físicas no Nível Atual

Você também pode usar `physical` com um prefixo de caminho vazio (ou um único argumento) para mesclar routes de um diretório físico diretamente no nível atual, sem adicionar um prefixo de caminho. Isso é útil quando você quer organizar suas routes em diretórios separados mas tê-las aparecendo no mesmo nível de URL.

Considere a seguinte estrutura de arquivos:

```
/routes
├── __root.tsx
├── about.tsx
└── features
    ├── index.tsx
    └── contact.tsx
```

Você pode mesclar as routes do diretório `features` no nível raiz:

```tsx
// routes.ts
import { physical, rootRoute, route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("__root.tsx", [
  route("/about", "about.tsx"),
  // Merge features/ routes at root level (no path prefix)
  physical("features"),
  // Or equivalently: physical('', 'features')
]);
```

Isso produzirá as seguintes routes:

- `/about` - de `about.tsx`
- `/` - de `features/index.tsx`
- `/contact` - de `features/contact.tsx`

> **Nota:** Ao mesclar no mesmo nível, certifique-se de que não haja caminhos de route conflitantes entre suas virtual routes e as routes do diretório físico. Se um conflito ocorrer (por exemplo, ambos têm uma route `/about`), o gerador lançará um erro.

## Virtual Routes Dentro do Roteamento Baseado em Arquivos do TanStack Router

A seção anterior mostrou como você pode usar a convenção de roteamento baseado em arquivos do TanStack Router dentro de uma configuração de virtual route.
No entanto, o oposto também é possível.
Você pode configurar a parte principal da árvore de routes do seu app usando a convenção de roteamento baseado em arquivos do TanStack Router e optar pela configuração de virtual route para subárvores específicas.

Considere a seguinte estrutura de arquivos:

```
/routes
├── __root.tsx
├── foo
│   ├── bar
│   │   ├── __virtual.ts
│   │   ├── details.tsx
│   │   ├── home.tsx
│   │   └── route.ts
│   └── bar.tsx
└── index.tsx
```

Vamos olhar o diretório `bar` que contém um arquivo especial chamado `__virtual.ts`. Esse arquivo instrui o gerador a mudar para a configuração de virtual file route para esse diretório (e seus diretórios filhos).

`__virtual.ts` configura as virtual routes para aquela subárvore particular da árvore de routes. Ele usa a mesma API explicada acima, com a única diferença sendo que nenhuma `rootRoute` é definida para aquela subárvore:

```tsx
// routes/foo/bar/__virtual.ts
import {
  defineVirtualSubtreeConfig,
  index,
  route,
} from "@tanstack/virtual-file-routes";

export default defineVirtualSubtreeConfig([
  index("home.tsx"),
  route("$id", "details.tsx"),
]);
```

A função auxiliar `defineVirtualSubtreeConfig` é modelada de forma semelhante ao `defineConfig` do Vite e permite definir uma configuração de subárvore via exportação padrão. A exportação padrão pode ser:

- um objeto de configuração de subárvore
- uma função retornando um objeto de configuração de subárvore
- uma função async retornando um objeto de configuração de subárvore

## Inception

Você pode misturar e combinar a convenção de roteamento baseado em arquivos do TanStack Router e a configuração de virtual route como quiser.
Vamos mais fundo!
Confira o seguinte exemplo que começa usando a convenção de roteamento baseado em arquivos, muda para configuração de virtual route para `/posts`, volta para a convenção de roteamento baseado em arquivos para `/posts/lets-go` apenas para mudar novamente para configuração de virtual route para `/posts/lets-go/deeper`.

```
├── __root.tsx
├── index.tsx
├── posts
│   ├── __virtual.ts
│   ├── details.tsx
│   ├── home.tsx
│   └── lets-go
│       ├── deeper
│       │   ├── __virtual.ts
│       │   └── home.tsx
│       └── index.tsx
└── posts.tsx
```

## Configuração via TanStack Router CLI

Se você está usando o TanStack Router CLI, pode configurar virtual file routes definindo o caminho do seu arquivo de routes no arquivo `tsr.config.json`:

```json
// tsr.config.json
{
  "virtualRouteConfig": "./routes.ts"
}
```

Ou você pode definir as virtual routes diretamente na configuração. Embora muito menos comum, isso permite configurá-las via TanStack Router CLI adicionando um objeto `virtualRouteConfig` ao seu arquivo `tsr.config.json` e definindo suas virtual routes passando o JSON resultante gerado pela chamada das funções reais `rootRoute`/`route`/`index`/etc do pacote `@tanstack/virtual-file-routes`:

```json
// tsr.config.json
{
  "virtualRouteConfig": {
    "type": "root",
    "file": "root.tsx",
    "children": [
      {
        "type": "index",
        "file": "home.tsx"
      },
      {
        "type": "route",
        "file": "posts/posts.tsx",
        "path": "/posts",
        "children": [
          {
            "type": "index",
            "file": "posts/posts-home.tsx"
          },
          {
            "type": "route",
            "file": "posts/posts-detail.tsx",
            "path": "$postId"
          }
        ]
      },
      {
        "type": "layout",
        "id": "first",
        "file": "layout/first-pathless-layout.tsx",
        "children": [
          {
            "type": "layout",
            "id": "second",
            "file": "layout/second-pathless-layout.tsx",
            "children": [
              {
                "type": "route",
                "file": "a.tsx",
                "path": "/route-a"
              },
              {
                "type": "route",
                "file": "b.tsx",
                "path": "/route-b"
              }
            ]
          }
        ]
      }
    ]
  }
}
```
