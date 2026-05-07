---
title: Search Params
---

Assim como o TanStack Query tornou o gerenciamento de server-state nas suas aplicações React e Solid muito mais fácil, o TanStack Router tem como objetivo desbloquear o poder dos search params de URL nas suas aplicações.

> 🧠 Se você está usando um navegador realmente antigo, como o IE11, pode ser necessário usar um polyfill para `URLSearchParams`.

## Por que não usar simplesmente `URLSearchParams`?

Entendemos, você tem ouvido muito sobre "use a plataforma" ultimamente e, na maior parte, concordamos. No entanto, também acreditamos que é importante reconhecer onde a plataforma fica aquém para casos de uso mais avançados, e acreditamos que `URLSearchParams` é uma dessas circunstâncias.

APIs tradicionais de Search Param geralmente assumem algumas coisas:

- Search params são sempre strings
- Eles são _majoritariamente_ planos
- Serializar e desserializar usando `URLSearchParams` é bom o suficiente (Spoiler: não é.)
- Modificações de search params são fortemente acopladas ao pathname da URL e devem ser atualizadas juntas, mesmo que o pathname não esteja mudando.

A realidade, porém, é muito diferente dessas suposições.

- Search params representam state da aplicação, então inevitavelmente, esperamos que eles tenham a mesma DX associada a outros gerenciadores de state. Isso significa ter a capacidade de distinguir entre tipos de valores primitivos e armazenar e manipular eficientemente estruturas de dados complexas como arrays aninhados e objetos.
- Existem muitas formas de serializar e desserializar state com diferentes trade-offs. Você deveria poder escolher a melhor para sua aplicação ou, no mínimo, ter um padrão melhor que `URLSearchParams`.
- Imutabilidade e Compartilhamento Estrutural. Toda vez que você converte search params de URL para string e os analisa, a integridade referencial e a identidade do objeto são perdidas porque cada nova análise cria uma estrutura de dados completamente nova com uma referência de memória única. Se não for gerenciado adequadamente ao longo de seu ciclo de vida, essa serialização e análise constantes podem resultar em problemas de desempenho inesperados e indesejáveis, especialmente em frameworks como React que optam por rastrear reatividade via imutabilidade ou em Solid que normalmente depende de reconciliação para detectar mudanças de fontes de dados desserializadas.
- Search params, embora sejam uma parte importante da URL, frequentemente mudam independentemente do pathname da URL. Por exemplo, um usuário pode querer mudar o número da página de uma lista paginada sem alterar o pathname da URL.

## Search Params, o Gerenciador de State "OG"

Você provavelmente já viu search params como `?page=3` ou `?filter-name=tanner` na URL. Não há dúvida de que isso é verdadeiramente **uma forma de state global** vivendo dentro da URL. É valioso armazenar partes específicas de state na URL porque:

- Os usuários devem ser capazes de:
  - Usar Cmd/Ctrl + Click para abrir um link em uma nova aba e ver de forma confiável o state que esperavam
  - Adicionar aos favoritos e compartilhar links da sua aplicação com outros com a garantia de que eles verão exatamente o state de quando o link foi copiado.
  - Atualizar sua aplicação ou navegar para frente e para trás entre páginas sem perder seu state
- Os desenvolvedores devem ser capazes de facilmente:
  - Adicionar, remover ou modificar state na URL com a mesma ótima DX de outros gerenciadores de state
  - Validar facilmente search params vindos da URL em um formato e tipo que seja seguro para a aplicação consumir
  - Ler e escrever em search params sem ter que se preocupar com o formato de serialização subjacente

## Search Params JSON-first

Para alcançar o descrito acima, o primeiro passo embutido no TanStack Router é um poderoso parser de search params que converte automaticamente a string de busca da sua URL para JSON estruturado. Isso significa que você pode armazenar qualquer estrutura de dados serializável em JSON nos seus search params e ela será analisada e serializada como JSON. Essa é uma melhoria enorme em relação ao `URLSearchParams`, que tem suporte limitado para estruturas do tipo array e dados aninhados.

Por exemplo, navegar para a seguinte route:

```tsx
const link = (
  <Link
    to="/shop"
    search={{
      pageIndex: 3,
      includeCategories: ["electronics", "gifts"],
      sortBy: "price",
      desc: true,
    }}
  />
);
```

Resultará na seguinte URL:

```
/shop?pageIndex=3&includeCategories=%5B%22electronics%22%2C%22gifts%22%5D&sortBy=price&desc=true
```

Quando essa URL é analisada, os search params serão convertidos de volta com precisão para o seguinte JSON:

```json
{
  "pageIndex": 3,
  "includeCategories": ["electronics", "gifts"],
  "sortBy": "price",
  "desc": true
}
```

Se você notou, algumas coisas estão acontecendo aqui:

- O primeiro nível dos search params é plano e baseado em string, assim como `URLSearchParams`.
- Valores de primeiro nível que não são strings são preservados com precisão como números e booleanos reais.
- Estruturas de dados aninhadas são automaticamente convertidas em strings JSON seguras para URL

> 🧠 É comum que outras ferramentas assumam que search params são sempre planos e baseados em string, e é por isso que escolhemos manter as coisas compatíveis com URLSearchParam no primeiro nível. Isso significa que, mesmo que o TanStack Router esteja gerenciando seus search params aninhados como JSON, outras ferramentas ainda poderão escrever na URL e ler parâmetros de primeiro nível normalmente.

## Validando e Tipando Search Params

Apesar do TanStack Router ser capaz de analisar search params em JSON confiável, eles ainda vieram de **uma entrada de texto bruto voltada ao usuário**. Semelhante a outros limites de serialização, isso significa que antes de consumir search params, eles devem ser validados em um formato no qual sua aplicação possa confiar e depender.

### Validação + TypeScript!

O TanStack Router fornece APIs convenientes para validar e tipar search params. Tudo começa com a opção `validateSearch` da `Route`:

```tsx
// /routes/shop.products.tsx

type ProductSearchSortOptions = "newest" | "oldest" | "price";

type ProductSearch = {
  page: number;
  filter: string;
  sort: ProductSearchSortOptions;
};

export const Route = createFileRoute("/shop/products")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    // validate and parse the search params into a typed state
    return {
      page: Number(search?.page ?? 1),
      filter: (search.filter as string) || "",
      sort: (search.sort as ProductSearchSortOptions) || "newest",
    };
  },
});
```

No exemplo acima, estamos validando os search params da `Route` e retornando um objeto tipado `ProductSearch`. Esse objeto tipado é então disponibilizado para as outras opções dessa route **e para quaisquer routes filhas também!**

### Validando Search Params

A opção `validateSearch` é uma função que recebe os search params analisados em JSON (mas não validados) como um `Record<string, unknown>` e retorna um objeto tipado da sua escolha. Geralmente é melhor fornecer fallbacks sensatos para search params malformados ou inesperados, para que a experiência dos seus usuários não seja interrompida.

Aqui está um exemplo:

```tsx
// /routes/shop.products.tsx

type ProductSearchSortOptions = "newest" | "oldest" | "price";

type ProductSearch = {
  page: number;
  filter: string;
  sort: ProductSearchSortOptions;
};

export const Route = createFileRoute("/shop/products")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    // validate and parse the search params into a typed state
    return {
      page: Number(search?.page ?? 1),
      filter: (search.filter as string) || "",
      sort: (search.sort as ProductSearchSortOptions) || "newest",
    };
  },
});
```

Aqui está um exemplo usando a biblioteca [Zod](https://zod.dev/) (mas fique à vontade para usar qualquer biblioteca de validação que preferir) para validar e tipar os search params em um único passo:

```tsx
// /routes/shop.products.tsx

import { z } from "zod";

const productSearchSchema = z.object({
  page: z.number().catch(1),
  filter: z.string().catch(""),
  sort: z.enum(["newest", "oldest", "price"]).catch("newest"),
});

type ProductSearch = z.infer<typeof productSearchSchema>;

export const Route = createFileRoute("/shop/products")({
  validateSearch: (search) => productSearchSchema.parse(search),
});
```

Como `validateSearch` também aceita um objeto com a propriedade `parse`, isso pode ser simplificado para:

```tsx
validateSearch: productSearchSchema;
```

No exemplo acima, usamos o modificador `.catch()` do Zod em vez de `.default()` para evitar mostrar um erro ao usuário, porque acreditamos firmemente que se um parâmetro de busca está malformado, você provavelmente não quer interromper a experiência do usuário pela aplicação para mostrar uma grande mensagem de erro. Dito isso, pode haver momentos em que você **realmente queira mostrar uma mensagem de erro**. Nesse caso, você pode usar `.default()` em vez de `.catch()`.

A mecânica subjacente de por que isso funciona depende da função `validateSearch` lançar um erro. Se um erro é lançado, a opção `onError` da route será acionada (e `error.routerCode` será definido como `VALIDATE_SEARCH` e o `errorComponent` será renderizado em vez do `component` da route, onde você pode lidar com o erro de search param como preferir.

#### Adapters

Ao usar uma biblioteca como [Zod](https://zod.dev/) para validar search params, você pode querer `transform` (transformar) search params antes de confirmar os search params na URL. Um `transform` comum do `zod` é o `default`, por exemplo.

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const productSearchSchema = z.object({
  page: z.number().default(1),
  filter: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest"),
});

export const Route = createFileRoute("/shop/products/")({
  validateSearch: productSearchSchema,
});
```

Pode ser surpreendente que quando você tenta navegar para essa route, `search` é obrigatório. O seguinte `Link` dará erro de tipo porque `search` está faltando.

```tsx
<Link to="/shop/products" />
```

Para bibliotecas de validação, recomendamos usar adapters que inferem os tipos corretos de `input` e `output`.

### Zod

Um adapter é fornecido para [Zod](https://zod.dev/) que encaminhará o tipo correto de `input` e o tipo correto de `output`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const productSearchSchema = z.object({
  page: z.number().default(1),
  filter: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest"),
});

export const Route = createFileRoute("/shop/products/")({
  validateSearch: zodValidator(productSearchSchema),
});
```

A parte importante aqui é que o seguinte uso de `Link` não requer mais search params

```tsx
<Link to="/shop/products" />
```

No entanto, o uso de `catch` aqui sobrescreve os tipos e torna `page`, `filter` e `sort` do tipo `unknown`, causando perda de tipos. Lidamos com esse caso fornecendo uma função genérica `fallback` que mantém os tipos, mas fornece um valor de `fallback` quando a validação falha

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const productSearchSchema = z.object({
  page: fallback(z.number(), 1).default(1),
  filter: fallback(z.string(), "").default(""),
  sort: fallback(z.enum(["newest", "oldest", "price"]), "newest").default(
    "newest",
  ),
});

export const Route = createFileRoute("/shop/products/")({
  validateSearch: zodValidator(productSearchSchema),
});
```

Portanto, ao navegar para essa route, `search` é opcional e mantém os tipos corretos.

Embora não recomendado, também é possível configurar os tipos de `input` e `output` caso o tipo `output` seja mais preciso que o tipo `input`

```tsx
const productSearchSchema = z.object({
  page: fallback(z.number(), 1).default(1),
  filter: fallback(z.string(), "").default(""),
  sort: fallback(z.enum(["newest", "oldest", "price"]), "newest").default(
    "newest",
  ),
});

export const Route = createFileRoute("/shop/products/")({
  validateSearch: zodValidator({
    schema: productSearchSchema,
    input: "output",
    output: "input",
  }),
});
```

Isso fornece flexibilidade sobre qual tipo você quer inferir para navegação e quais tipos você quer inferir para leitura de search params.

### Valibot

> [!WARNING]
> O Router espera que o pacote valibot 1.0 esteja instalado.

Ao usar [Valibot](https://valibot.dev/), um adapter não é necessário para garantir que os tipos corretos de `input` e `output` sejam usados para navegação e leitura de search params. Isso porque o `valibot` implementa [Standard Schema](https://github.com/standard-schema/standard-schema)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

const productSearchSchema = v.object({
  page: v.optional(v.fallback(v.number(), 1), 1),
  filter: v.optional(v.fallback(v.string(), ""), ""),
  sort: v.optional(
    v.fallback(v.picklist(["newest", "oldest", "price"]), "newest"),
    "newest",
  ),
});

export const Route = createFileRoute("/shop/products/")({
  validateSearch: productSearchSchema,
});
```

### Arktype

> [!WARNING]
> O Router espera que o pacote arktype 2.0-rc esteja instalado.

Ao usar [ArkType](https://arktype.io/), um adapter não é necessário para garantir que os tipos corretos de `input` e `output` sejam usados para navegação e leitura de search params. Isso porque o [ArkType](https://arktype.io/) implementa [Standard Schema](https://github.com/standard-schema/standard-schema)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { type } from "arktype";

const productSearchSchema = type({
  page: "number = 1",
  filter: 'string = ""',
  sort: '"newest" | "oldest" | "price" = "newest"',
});

export const Route = createFileRoute("/shop/products/")({
  validateSearch: productSearchSchema,
});
```

### Effect/Schema

Ao usar [Effect/Schema](https://effect.website/docs/schema/introduction/), um adapter não é necessário para garantir que os tipos corretos de `input` e `output` sejam usados para navegação e leitura de search params. Isso porque o [Effect/Schema](https://effect.website/docs/schema/standard-schema/) implementa [Standard Schema](https://github.com/standard-schema/standard-schema)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Schema as S } from "effect";

const productSearchSchema = S.standardSchemaV1(
  S.Struct({
    page: S.NumberFromString.pipe(
      S.optional,
      S.withDefaults({
        constructor: () => 1,
        decoding: () => 1,
      }),
    ),
    filter: S.String.pipe(
      S.optional,
      S.withDefaults({
        constructor: () => "",
        decoding: () => "",
      }),
    ),
    sort: S.Literal("newest", "oldest", "price").pipe(
      S.optional,
      S.withDefaults({
        constructor: () => "newest" as const,
        decoding: () => "newest" as const,
      }),
    ),
  }),
);

export const Route = createFileRoute("/shop/products/")({
  validateSearch: productSearchSchema,
});
```

## Lendo Search Params

Uma vez que seus search params foram validados e tipados, você está finalmente pronto para começar a lê-los e escrevê-los. Existem algumas formas de fazer isso no TanStack Router, então vamos conferir.

### Usando Search Params em Loaders

Por favor, leia a seção [Search Params em Loaders](./data-loading.md#using-loaderdeps-to-access-search-params) para mais informações sobre como ler search params em loaders com a opção `loaderDeps`.

### Search Params são herdados das Routes Pai

Os parâmetros de busca e tipos dos pais são mesclados conforme você desce na árvore de routes, então routes filhas também têm acesso aos search params dos pais:

- `shop.products.tsx`

```tsx
const productSearchSchema = z.object({
  page: z.number().catch(1),
  filter: z.string().catch(""),
  sort: z.enum(["newest", "oldest", "price"]).catch("newest"),
});

type ProductSearch = z.infer<typeof productSearchSchema>;

export const Route = createFileRoute("/shop/products")({
  validateSearch: productSearchSchema,
});
```

- `shop.products.$productId.tsx`

```tsx
export const Route = createFileRoute("/shop/products/$productId")({
  beforeLoad: ({ search }) => {
    search;
    // ^? ProductSearch ✅
  },
});
```

### Search Params em Components

Você pode acessar os search params validados da sua route no `component` da route via o hook `useSearch`.

```tsx
// /routes/shop.products.tsx

export const Route = createFileRoute("/shop/products")({
  validateSearch: productSearchSchema,
});

const ProductList = () => {
  const { page, filter, sort } = Route.useSearch();

  return <div>...</div>;
};
```

> [!TIP]
> Se seu component é code-split, você pode usar a [função getRouteApi](./code-splitting.md#manually-accessing-route-apis-in-other-files-with-the-getrouteapi-helper) para evitar ter que importar a configuração da `Route` para obter acesso ao hook tipado `useSearch()`.

### Search Params fora de Route Components

Você pode acessar os search params validados da sua route em qualquer lugar da aplicação usando o hook `useSearch`. Passando o id/caminho `from` da sua route de origem, você terá uma segurança de tipos ainda melhor:

```tsx
// /routes/shop.products.tsx
export const Route = createFileRoute("/shop/products")({
  validateSearch: productSearchSchema,
  // ...
});

// Somewhere else...

// /components/product-list-sidebar.tsx
const routeApi = getRouteApi("/shop/products");

const ProductList = () => {
  const routeSearch = routeApi.useSearch();

  // OR

  const { page, filter, sort } = useSearch({
    from: Route.fullPath,
  });

  return <div>...</div>;
};
```

Ou, você pode relaxar a segurança de tipos e obter um objeto `search` opcional passando `strict: false`:

```tsx
function ProductList() {
  const search = useSearch({
    strict: false,
  });
  // {
  //   page: number | undefined
  //   filter: string | undefined
  //   sort: 'newest' | 'oldest' | 'price' | undefined
  // }

  return <div>...</div>;
}
```

## Escrevendo Search Params

Agora que você aprendeu como ler os search params da sua route, ficará feliz em saber que já viu as APIs principais para modificá-los e atualizá-los. Vamos relembrar um pouco

### `<Link search />`

A melhor forma de atualizar search params é usar a prop `search` no component `<Link />`.

Se o search da página atual deve ser atualizado e a prop `from` está especificada, a prop `to` pode ser omitida.
Aqui está um exemplo:

```tsx
// /routes/shop.products.tsx
export const Route = createFileRoute("/shop/products")({
  validateSearch: productSearchSchema,
});

const ProductList = () => {
  return (
    <div>
      <Link from={Route.fullPath} search={(prev) => ({ page: prev.page + 1 })}>
        Next Page
      </Link>
    </div>
  );
};
```

Se você quer atualizar os search params em um component genérico que é renderizado em múltiplas routes, especificar `from` pode ser desafiador.

Neste cenário, você pode definir `to="."` que lhe dará acesso a search params com tipagem mais flexível.
Aqui está um exemplo que ilustra isso:

```tsx
// `page` is a search param that is defined in the __root route and hence available on all routes.
const PageSelector = () => {
  return (
    <div>
      <Link to="." search={(prev) => ({ ...prev, page: prev.page + 1 })}>
        Next Page
      </Link>
    </div>
  );
};
```

Se o component genérico é renderizado apenas em uma subárvore específica da árvore de routes, você pode especificar essa subárvore usando `from`. Aqui você pode omitir `to='.'` se quiser.

```tsx
// `page` is a search param that is defined in the /posts route and hence available on all of its child routes.
const PageSelector = () => {
  return (
    <div>
      <Link
        from="/posts"
        to="."
        search={(prev) => ({ ...prev, page: prev.page + 1 })}
      >
        Next Page
      </Link>
    </div>
  )
```

### `useNavigate(), navigate({ search })`

A função `navigate` também aceita uma opção `search` que funciona da mesma forma que a prop `search` no `<Link />`:

```tsx
// /routes/shop.products.tsx
export const Route = createFileRoute("/shop/products/$productId")({
  validateSearch: productSearchSchema,
});

const ProductList = () => {
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <div>
      <button
        onClick={() => {
          navigate({
            search: (prev) => ({ page: prev.page + 1 }),
          });
        }}
      >
        Next Page
      </button>
    </div>
  );
};
```

### `router.navigate({ search })`

A função `router.navigate` funciona exatamente da mesma forma que o hook/função `useNavigate`/`navigate` acima.

### `<Navigate search />`

O component `<Navigate search />` funciona exatamente da mesma forma que o hook/função `useNavigate`/`navigate` acima, mas aceita suas opções como props em vez de um argumento de função.

## Transformando search com search middlewares

Quando hrefs de links são construídos, por padrão a única coisa que importa para a parte da query string é a propriedade `search` de um `<Link>`.

O TanStack Router fornece uma maneira de manipular search params antes que o href seja gerado via **search middlewares**.
Search middlewares são funções que transformam os parâmetros de busca ao gerar novos links para uma route ou seus descendentes.
Eles também são executados na navegação após a validação de search para permitir a manipulação da query string.

O exemplo a seguir mostra como garantir que para **todo** link que está sendo construído, o search param `rootValue` seja adicionado _se_ ele fizer parte dos search params atuais. Se um link especifica `rootValue` dentro de `search`, então esse valor é usado para construir o link.

```tsx
import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  rootValue: z.string().optional(),
});

export const Route = createRootRoute({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [
      ({ search, next }) => {
        const result = next(search);
        return {
          rootValue: search.rootValue,
          ...result,
        };
      },
    ],
  },
});
```

Como esse caso de uso específico é bastante comum, o TanStack Router fornece uma implementação genérica para reter search params via `retainSearchParams`:

```tsx
import { z } from "zod";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  rootValue: z.string().optional(),
});

export const Route = createRootRoute({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [retainSearchParams(["rootValue"])],
  },
});
```

Outro caso de uso comum é remover search params dos links se seu valor padrão está definido. O TanStack Router fornece uma implementação genérica para esse caso de uso via `stripSearchParams`:

```tsx
import { z } from "zod";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

const defaultValues = {
  one: "abc",
  two: "xyz",
};

const searchSchema = z.object({
  one: z.string().default(defaultValues.one),
  two: z.string().default(defaultValues.two),
});

export const Route = createFileRoute("/hello")({
  validateSearch: zodValidator(searchSchema),
  search: {
    // strip default values
    middlewares: [stripSearchParams(defaultValues)],
  },
});
```

Múltiplos middlewares podem ser encadeados. O exemplo a seguir mostra como combinar tanto `retainSearchParams` quanto `stripSearchParams`.

```tsx
import {
  Link,
  createFileRoute,
  retainSearchParams,
  stripSearchParams,
} from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const defaultValues = ["foo", "bar"];

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(
    z.object({
      retainMe: z.string().optional(),
      arrayWithDefaults: z.string().array().default(defaultValues),
      required: z.string(),
    }),
  ),
  search: {
    middlewares: [
      retainSearchParams(["retainMe"]),
      stripSearchParams({ arrayWithDefaults: defaultValues }),
    ],
  },
});
```
