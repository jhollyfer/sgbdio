---
title: Automatic Code Splitting
---

O recurso de automatic code splitting no TanStack Router permite que você otimize o tamanho do bundle da sua aplicação carregando de forma lazy os route components e seus dados associados. Isso é particularmente útil para aplicações grandes onde você quer minimizar o tempo de carregamento inicial carregando apenas o código necessário para a route atual.

Para ativar esse recurso, simplesmente defina a opção `autoCodeSplitting` como `true` na configuração do seu bundler plugin. Isso habilita o router a lidar automaticamente com o code splitting das suas routes sem exigir nenhuma configuração adicional.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true, // Enable automatic code splitting
    }),
  ],
});
```

Mas isso é apenas o começo! O automatic code splitting do TanStack Router não é apenas fácil de habilitar, mas também fornece opções poderosas de personalização para ajustar como suas routes são divididas em chunks. Isso permite que você otimize a performance da sua aplicação com base nas suas necessidades e padrões de uso específicos.

## Como funciona?

O automatic code splitting do TanStack Router funciona transformando seus arquivos de route tanto durante o 'development' quanto no momento do 'build'. Ele reescreve as definições de route para usar wrappers de lazy-loading para components e loaders, o que permite ao bundler agrupar essas propriedades em chunks separados.

> [!TIP]
> Um **chunk** é um arquivo que contém uma porção do código da sua aplicação, que pode ser carregado sob demanda. Isso ajuda a reduzir o tempo de carregamento inicial da sua aplicação carregando apenas o código necessário para a route atual.

Então, quando sua aplicação carrega, ela não inclui todo o código de cada route. Em vez disso, inclui apenas o código das routes que são inicialmente necessárias. Conforme os usuários navegam pela sua aplicação, chunks adicionais são carregados sob demanda.

Isso acontece de forma transparente, sem exigir que você divida manualmente seu código ou gerencie o lazy loading. O TanStack Router bundler plugin cuida de tudo, garantindo que suas routes sejam otimizadas para performance desde o início.

### O processo de transformação

Quando você habilita o automatic code splitting, o bundler plugin faz isso usando análise estática de código para examinar o código nos seus arquivos de route e transformá-los em saídas otimizadas.

Esse processo de transformação produz duas saídas principais quando cada um dos seus arquivos de route é processado:

1. **Arquivo de Referência**: O bundler plugin pega o seu arquivo de route original (ex.: `posts.route.tsx`) e modifica os valores de propriedades como `component` ou `pendingComponent` para usar wrappers especiais de lazy-loading que vão buscar o código real depois. Esses wrappers apontam para um arquivo "virtual" que o bundler vai resolver posteriormente.
2. **Arquivo Virtual**: Quando o bundler vê uma requisição para um desses arquivos virtuais (ex.: `posts.route.tsx?tsr-split=component`), ele a intercepta para gerar um novo arquivo mínimo on-the-fly que _apenas_ contém o código das propriedades solicitadas (ex.: apenas o `PostsComponent`).

Esse processo garante que seu código original permaneça limpo e legível, enquanto a saída bundled real é otimizada para o tamanho inicial do bundle.

### O que sofre code splitting?

A decisão do que separar em chunks distintos é crucial para otimizar a performance da sua aplicação. O TanStack Router usa um conceito chamado "**Split Groupings**" para determinar como diferentes partes da sua route devem ser agrupadas.

Split groupings são arrays de propriedades que dizem ao TanStack Router como agrupar diferentes partes da sua route. Cada agrupamento é uma lista de nomes de propriedades que você quer agrupar em um único chunk carregado de forma lazy.

As propriedades disponíveis para separar são:

- `component`
- `errorComponent`
- `pendingComponent`
- `notFoundComponent`
- `loader`

Por padrão, o TanStack Router usa os seguintes split groupings:

```sh
[
  ['component'],
  ['errorComponent'],
  ['notFoundComponent']
]
```

Isso significa que ele cria três chunks separados carregados de forma lazy para cada route. Resultando em:

- Um para o component principal
- Um para o error component
- E um para o not-found component.

### Regras do Splitting

Para que o automatic code splitting funcione, existem algumas regras em vigor para garantir que esse processo possa acontecer de forma confiável e previsível.

#### Não exporte propriedades de route

Propriedades de route como `component`, `loader`, etc., não devem ser exportadas do arquivo de route. Exportar essas propriedades faz com que sejam incluídas no bundle principal da aplicação, o que significa que não sofrerão code splitting.

```tsx
import { createRoute } from "@tanstack/react-router";

export const Route = createRoute("/posts")({
  // ...
  notFoundComponent: PostsNotFoundComponent,
});

// ❌ Do NOT do this!
// Exporting the notFoundComponent will prevent it from being code-split
// and will be included in the main bundle.
export function PostsNotFoundComponent() {
  // ❌
  // ...
}

function PostsNotFoundComponent() {
  // ✅
  // ...
}
```

**Pronto!** Não há outras restrições. Você pode usar quaisquer outros recursos de JavaScript ou TypeScript nos seus arquivos de route como faria normalmente. Se encontrar algum problema, por favor [abra uma issue](https://github.com/tanstack/router/issues) no GitHub.

## Controle granular

Para a maioria das aplicações, o comportamento padrão de usar `autoCodeSplitting: true` é suficiente. No entanto, o TanStack Router fornece várias opções para personalizar como suas routes são divididas em chunks, permitindo que você otimize para casos de uso ou necessidades de performance específicos.

### Comportamento global de code splitting (`defaultBehavior`)

Você pode mudar como o TanStack Router divide suas routes alterando a opção `defaultBehavior` na configuração do seu bundler plugin. Isso permite que você defina como diferentes propriedades das suas routes devem ser agrupadas.

Por exemplo, para agrupar todos os components relacionados à UI em um único chunk, você poderia configurar assim:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      codeSplittingOptions: {
        defaultBehavior: [
          [
            "component",
            "pendingComponent",
            "errorComponent",
            "notFoundComponent",
          ], // Bundle all UI components together
        ],
      },
    }),
  ],
});
```

### Controle programático avançado (`splitBehavior`)

Para conjuntos de regras complexos, você pode usar a função `splitBehavior` na sua config do vite para definir programaticamente como as routes devem ser divididas em chunks com base no seu `routeId`. Essa função permite que você implemente lógica customizada para agrupar propriedades, dando controle refinado sobre o comportamento de code splitting.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      codeSplittingOptions: {
        splitBehavior: ({ routeId }) => {
          // For all routes under /posts, bundle the loader and component together
          if (routeId.startsWith("/posts")) {
            return [["loader", "component"]];
          }
          // All other routes will use the `defaultBehavior`
        },
      },
    }),
  ],
});
```

### Overrides por route (`codeSplitGroupings`)

Para controle total, você pode sobrescrever a configuração global diretamente dentro de um arquivo de route adicionando a propriedade `codeSplitGroupings`. Isso é útil para routes que têm necessidades de otimização únicas.

```tsx
// src/routes/posts.route.tsx
import { createFileRoute } from "@tanstack/react-router";
import { loadPostsData } from "./-heavy-posts-utils";

export const Route = createFileRoute("/posts")({
  // For this specific route, bundle the loader and component together.
  codeSplitGroupings: [["loader", "component"]],
  loader: () => loadPostsData(),
  component: PostsComponent,
});

function PostsComponent() {
  // ...
}
```

Isso vai criar um único chunk que inclui tanto o `loader` quanto o `component` para essa route específica, sobrescrevendo tanto o comportamento padrão quanto qualquer comportamento de split programático definido na config do seu bundler.

### A ordem de configuração importa

Este guia descreveu até agora três formas diferentes de configurar como o TanStack Router divide suas routes em chunks.

Para garantir que as diferentes configurações não entrem em conflito entre si, o TanStack Router usa a seguinte ordem de precedência:

1. **Overrides por route**: A propriedade `codeSplitGroupings` dentro de um arquivo de route tem a maior precedência. Isso permite que você defina split groupings específicos para routes individuais.
2. **Comportamento de split programático**: A função `splitBehavior` na config do seu bundler permite que você defina lógica customizada para como as routes devem ser divididas com base no seu `routeId`.
3. **Comportamento padrão**: A opção `defaultBehavior` na config do seu bundler serve como fallback para qualquer route que não tenha overrides específicos ou lógica customizada definida. Esta é a configuração base que se aplica a todas as routes, a menos que seja sobrescrita.

### Separando o Data Loader

A função `loader` é responsável por buscar os dados necessários pela route. Por padrão, ela é agrupada no seu "arquivo de referência" e carregada no bundle inicial. No entanto, você também pode separar o `loader` em seu próprio chunk se quiser otimizar ainda mais.

> [!CAUTION]
> Mover o `loader` para seu próprio chunk é um **trade-off de performance**. Isso introduz uma viagem adicional ao servidor antes que os dados possam ser buscados, o que pode levar a carregamentos iniciais de página mais lentos. Isso porque o `loader` **precisa** ser buscado e executado antes que a route possa renderizar seu component.
> Portanto, recomendamos manter o `loader` no bundle inicial, a menos que você tenha um motivo específico para separá-lo.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      codeSplittingOptions: {
        defaultBehavior: [
          ["loader"], // The loader will be in its own chunk
          ["component"],
          // ... other component groupings
        ],
      },
    }),
  ],
});
```

Nós desencorajamos fortemente separar o `loader` a menos que você tenha um caso de uso específico que exija isso. Na maioria dos casos, não separar o `loader` e mantê-lo no bundle principal é a melhor escolha para performance.
