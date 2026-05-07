---
title: Path Params
---

Path params são usados para corresponder a um único segmento (o texto até a próxima `/`) e fornecer seu valor de volta para você como uma variável **nomeada**. Eles são definidos usando o caractere prefixo `$` no caminho, seguido pela variável de chave para atribuí-lo. Os seguintes são caminhos de path param válidos:

- `$postId`
- `$name`
- `$teamId`
- `about/$name`
- `team/$teamId`
- `blog/$postId`

Como routes de path param só correspondem até a próxima `/`, routes filhas podem ser criadas para continuar expressando hierarquia:

Vamos criar um arquivo de route de post que usa um path param para corresponder ao ID do post:

- `posts.$postId.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ params }) => {
    return fetchPost(params.postId);
  },
});
```

## Path Params podem ser usados por routes filhas

Uma vez que um path param foi parseado, ele fica disponível para todas as routes filhas. Isso significa que se definirmos uma route filha para nossa `postRoute`, podemos usar a variável `postId` da URL no caminho da route filha!

## Path Params em Loaders

Path params são passados para o loader como um objeto `params`. As chaves desse objeto são os nomes dos path params, e os valores são os valores que foram parseados do caminho real da URL. Por exemplo, se visitássemos a URL `/blog/123`, o objeto `params` seria `{ postId: '123' }`:

```tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ params }) => {
    return fetchPost(params.postId);
  },
});
```

O objeto `params` também é passado para a opção `beforeLoad`:

```tsx
export const Route = createFileRoute("/posts/$postId")({
  beforeLoad: async ({ params }) => {
    // do something with params.postId
  },
});
```

## Path Params em Components

Se adicionarmos um component à nossa `postRoute`, podemos acessar a variável `postId` da URL usando o hook `useParams` da route:

```tsx
export const Route = createFileRoute("/posts/$postId")({
  component: PostComponent,
});

function PostComponent() {
  const { postId } = Route.useParams();
  return <div>Post {postId}</div>;
}
```

> 🧠 Dica rápida: Se seu component tiver code splitting, você pode usar a [função getRouteApi](./code-splitting.md#manually-accessing-route-apis-in-other-files-with-the-getrouteapi-helper) para evitar ter que importar a configuração `Route` para obter acesso ao hook `useParams()` tipado.

## Path Params fora de Routes

Você também pode usar o hook `useParams` exportado globalmente para acessar qualquer path param parseado de qualquer component na sua aplicação. Você precisará passar a opção `strict: false` para `useParams`, indicando que deseja acessar os params de uma localização ambígua:

```tsx
function PostComponent() {
  const { postId } = useParams({ strict: false });
  return <div>Post {postId}</div>;
}
```

## Navegando com Path Params

Ao navegar para uma route com path params, TypeScript exigirá que você passe os params como um objeto ou como uma função que retorna um objeto de params.

Vamos ver como fica o estilo de objeto:

```tsx
function Component() {
  return (
    <Link to="/blog/$postId" params={{ postId: "123" }}>
      Post 123
    </Link>
  );
}
```

E aqui está como fica o estilo de função:

```tsx
function Component() {
  return (
    <Link to="/blog/$postId" params={(prev) => ({ ...prev, postId: "123" })}>
      Post 123
    </Link>
  );
}
```

Note que o estilo de função é útil quando você precisa manter params que já estão na URL para outras routes. Isso porque o estilo de função receberá os params atuais como argumento, permitindo que você os modifique conforme necessário e retorne o objeto de params final.

## Prefixos e Sufixos para Path Params

Você também pode usar **prefixos** e **sufixos** com path params para criar padrões de roteamento mais complexos. Isso permite que você corresponda a estruturas de URL específicas enquanto ainda captura os segmentos dinâmicos.

Ao usar prefixos ou sufixos, você pode defini-los envolvendo o path param em chaves `{}` e colocando o prefixo ou sufixo antes ou depois do nome da variável.

### Definindo Prefixos

Prefixos são definidos colocando o texto do prefixo fora das chaves antes do nome da variável. Por exemplo, se você quiser corresponder a uma URL que começa com `post-` seguido de um ID de post, você pode definir assim:

```tsx
// src/routes/posts/post-{$postId}.tsx
export const Route = createFileRoute("/posts/post-{$postId}")({
  component: PostComponent,
});

function PostComponent() {
  const { postId } = Route.useParams();
  // postId will be the value after 'post-'
  return <div>Post ID: {postId}</div>;
}
```

Você pode até combinar prefixos com routes curinga para criar padrões mais complexos:

```tsx
// src/routes/on-disk/storage-{$}
export const Route = createFileRoute("/on-disk/storage-{$postId}/$")({
  component: StorageComponent,
});

function StorageComponent() {
  const { _splat } = Route.useParams();
  // _splat, will be value after 'storage-'
  // i.e. my-drive/documents/foo.txt
  return <div>Storage Location: /{_splat}</div>;
}
```

### Definindo Sufixos

Sufixos são definidos colocando o texto do sufixo fora das chaves após o nome da variável. Por exemplo, se você quiser corresponder a uma URL de um nome de arquivo que termina com `txt`, você pode definir assim:

```tsx
// src/routes/files/{$fileName}txt
export const Route = createFileRoute("/files/{$fileName}.txt")({
  component: FileComponent,
});

function FileComponent() {
  const { fileName } = Route.useParams();
  // fileName will be the value before 'txt'
  return <div>File Name: {fileName}</div>;
}
```

Você também pode combinar sufixos com curingas para padrões de roteamento mais complexos:

```tsx
// src/routes/files/{$}[.]txt
export const Route = createFileRoute("/files/{$fileName}[.]txt")({
  component: FileComponent,
});

function FileComponent() {
  const { _splat } = Route.useParams();
  // _splat will be the value before '.txt'
  return <div>File Splat: {_splat}</div>;
}
```

### Combinando Prefixos e Sufixos

Você pode combinar prefixos e sufixos para criar padrões de roteamento muito específicos. Por exemplo, se você quiser corresponder a uma URL que começa com `user-` e termina com `.json`, você pode definir assim:

```tsx
// src/routes/users/user-{$userId}.json
export const Route = createFileRoute("/users/user-{$userId}.json")({
  component: UserComponent,
});

function UserComponent() {
  const { userId } = Route.useParams();
  // userId will be the value between 'user-' and '.json'
  return <div>User ID: {userId}</div>;
}
```

Similar aos exemplos anteriores, você também pode usar curingas com prefixos e sufixos. Use a criatividade!

## Parâmetros de Caminho Opcionais

Parâmetros de caminho opcionais permitem que você defina segmentos de route que podem ou não estar presentes na URL. Eles usam a sintaxe `{-$paramName}` e fornecem padrões de roteamento flexíveis onde certos parâmetros são opcionais.

### Definindo Parâmetros Opcionais

Parâmetros de caminho opcionais são definidos usando chaves com um prefixo de traço: `{-$paramName}`

```tsx
// Single optional parameter
// src/routes/posts/{-$category}.tsx
export const Route = createFileRoute("/posts/{-$category}")({
  component: PostsComponent,
});

// Multiple optional parameters
// src/routes/posts/{-$category}/{-$slug}.tsx
export const Route = createFileRoute("/posts/{-$category}/{-$slug}")({
  component: PostComponent,
});

// Mixed required and optional parameters
// src/routes/users/$id/{-$tab}.tsx
export const Route = createFileRoute("/users/$id/{-$tab}")({
  component: UserComponent,
});
```

### Como os Parâmetros Opcionais Funcionam

Parâmetros opcionais criam padrões de URL flexíveis:

- `/posts/{-$category}` corresponde tanto a `/posts` quanto a `/posts/tech`
- `/posts/{-$category}/{-$slug}` corresponde a `/posts`, `/posts/tech` e `/posts/tech/hello-world`
- `/users/$id/{-$tab}` corresponde a `/users/123` e `/users/123/settings`

Quando um parâmetro opcional não está presente na URL, seu valor será `undefined` nos seus handlers de route e components.

### Acessando Parâmetros Opcionais

Parâmetros opcionais funcionam exatamente como parâmetros regulares nos seus components, mas seus valores podem ser `undefined`:

```tsx
function PostsComponent() {
  const { category } = Route.useParams();

  return <div>{category ? `Posts in ${category}` : "All Posts"}</div>;
}
```

### Parâmetros Opcionais em Loaders

Parâmetros opcionais estão disponíveis em loaders e podem ser `undefined`:

```tsx
export const Route = createFileRoute("/posts/{-$category}")({
  loader: async ({ params }) => {
    // params.category might be undefined
    return fetchPosts({ category: params.category });
  },
});
```

### Parâmetros Opcionais em beforeLoad

Parâmetros opcionais também funcionam em handlers `beforeLoad`:

```tsx
export const Route = createFileRoute("/posts/{-$category}")({
  beforeLoad: async ({ params }) => {
    if (params.category) {
      // Validate category exists
      await validateCategory(params.category);
    }
  },
});
```

### Padrões Avançados de Parâmetros Opcionais

#### Com Prefixo e Sufixo

Parâmetros opcionais suportam padrões de prefixo e sufixo:

```tsx
// File route: /files/prefix{-$name}.txt
// Matches: /files/prefix.txt and /files/prefixdocument.txt
export const Route = createFileRoute("/files/prefix{-$name}.txt")({
  component: FileComponent,
});

function FileComponent() {
  const { name } = Route.useParams();
  return <div>File: {name || "default"}</div>;
}
```

#### Todos os Parâmetros Opcionais

Você pode criar routes onde todos os parâmetros são opcionais:

```tsx
// Route: /{-$year}/{-$month}/{-$day}
// Matches: /, /2023, /2023/12, /2023/12/25
export const Route = createFileRoute("/{-$year}/{-$month}/{-$day}")({
  component: DateComponent,
});

function DateComponent() {
  const { year, month, day } = Route.useParams();

  if (!year) return <div>Select a year</div>;
  if (!month) return <div>Year: {year}</div>;
  if (!day)
    return (
      <div>
        Month: {year}/{month}
      </div>
    );

  return (
    <div>
      Date: {year}/{month}/{day}
    </div>
  );
}
```

#### Parâmetros Opcionais com Curingas

Parâmetros opcionais podem ser combinados com curingas para padrões de roteamento complexos:

```tsx
// Route: /docs/{-$version}/$
// Matches: /docs/extra/path, /docs/v2/extra/path
export const Route = createFileRoute("/docs/{-$version}/$")({
  component: DocsComponent,
});

function DocsComponent() {
  const { version } = Route.useParams();
  const { _splat } = Route.useParams();

  return (
    <div>
      Version: {version || "latest"}
      Path: {_splat}
    </div>
  );
}
```

### Navegando com Parâmetros Opcionais

Ao navegar para routes com parâmetros opcionais, você tem controle granular sobre quais parâmetros incluir:

```tsx
function Navigation() {
  return (
    <div>
      {/* Navigate with optional parameter */}
      <Link to="/posts/{-$category}" params={{ category: "tech" }}>
        Tech Posts
      </Link>

      {/* Navigate without optional parameter */}
      <Link to="/posts/{-$category}" params={{ category: undefined }}>
        All Posts
      </Link>

      {/* Navigate with multiple optional parameters */}
      <Link
        to="/posts/{-$category}/{-$slug}"
        params={{ category: "tech", slug: "react-tips" }}
      >
        Specific Post
      </Link>
    </div>
  );
}
```

### Type Safety com Parâmetros Opcionais

TypeScript fornece type safety completa para parâmetros opcionais:

```tsx
function PostsComponent() {
  // TypeScript knows category might be undefined
  const { category } = Route.useParams() // category: string | undefined

  // Safe navigation
  const categoryUpper = category?.toUpperCase()

  return <div>{categoryUpper || 'All Categories'}</div>
}

// Navigation is type-safe and flexible
<Link
  to="/posts/{-$category}"
  params={{ category: 'tech' }} // ✅ Valid - string
>
  Tech Posts
</Link>

<Link
  to="/posts/{-$category}"
  params={{ category: 123 }} // ✅ Valid - number (auto-stringified)
>
  Category 123
</Link>
```

## Internacionalização (i18n) com Parâmetros de Caminho Opcionais

Parâmetros de caminho opcionais são excelentes para implementar padrões de roteamento de internacionalização (i18n). Você pode usar padrões de prefixo para lidar com múltiplos idiomas enquanto mantém URLs limpos e amigáveis para SEO.

### i18n baseado em Prefixo

Use prefixos de idioma opcionais para suportar URLs como `/en/about`, `/fr/about`, ou apenas `/about` (idioma padrão):

```tsx
// Route: /{-$locale}/about
export const Route = createFileRoute("/{-$locale}/about")({
  component: AboutComponent,
});

function AboutComponent() {
  const { locale } = Route.useParams();
  const currentLocale = locale || "en"; // Default to English

  const content = {
    en: { title: "About Us", description: "Learn more about our company." },
    fr: {
      title: "À Propos",
      description: "En savoir plus sur notre entreprise.",
    },
    es: {
      title: "Acerca de",
      description: "Conoce más sobre nuestra empresa.",
    },
  };

  return (
    <div>
      <h1>{content[currentLocale]?.title}</h1>
      <p>{content[currentLocale]?.description}</p>
    </div>
  );
}
```

Este padrão corresponde:

- `/about` (locale padrão)
- `/en/about` (inglês explícito)
- `/fr/about` (francês)
- `/es/about` (espanhol)

### Padrões Complexos de i18n

Combine parâmetros opcionais para roteamento i18n mais sofisticado:

```tsx
// Route: /{-$locale}/blog/{-$category}/$slug
export const Route = createFileRoute("/{-$locale}/blog/{-$category}/$slug")({
  beforeLoad: async ({ params }) => {
    const locale = params.locale || "en";
    const category = params.category;

    // Validate locale and category
    const validLocales = ["en", "fr", "es", "de"];
    if (locale && !validLocales.includes(locale)) {
      throw new Error("Invalid locale");
    }

    return { locale, category };
  },
  loader: async ({ params, context }) => {
    const { locale } = context;
    const { slug, category } = params;

    return fetchBlogPost({ slug, category, locale });
  },
  component: BlogPostComponent,
});

function BlogPostComponent() {
  const { locale, category, slug } = Route.useParams();
  const data = Route.useLoaderData();

  return (
    <article>
      <h1>{data.title}</h1>
      <p>
        Category: {category || "All"} | Language: {locale || "en"}
      </p>
      <div>{data.content}</div>
    </article>
  );
}
```

Isso suporta URLs como:

- `/blog/tech/my-post` (locale padrão, categoria tech)
- `/fr/blog/my-post` (francês, sem categoria)
- `/en/blog/tech/my-post` (inglês explícito, categoria tech)
- `/es/blog/tecnologia/mi-post` (espanhol, categoria em espanhol)

### Navegação de Idioma

Crie seletores de idioma usando parâmetros opcionais de i18n com params no estilo de função:

```tsx
function LanguageSwitcher() {
  const currentParams = useParams({ strict: false });

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
  ];

  return (
    <div className="language-switcher">
      {languages.map(({ code, name }) => (
        <Link
          key={code}
          to="/{-$locale}/blog/{-$category}/$slug"
          params={(prev) => ({
            ...prev,
            locale: code === "en" ? undefined : code, // Remove 'en' for clean URLs
          })}
          className={currentParams.locale === code ? "active" : ""}
        >
          {name}
        </Link>
      ))}
    </div>
  );
}
```

Você também pode criar lógica de troca de idioma mais sofisticada:

```tsx
function AdvancedLanguageSwitcher() {
  const currentParams = useParams({ strict: false });

  const handleLanguageChange = (newLocale: string) => {
    return (prev: any) => {
      // Preserve all existing params but update locale
      const updatedParams = { ...prev };

      if (newLocale === "en") {
        // Remove locale for clean English URLs
        delete updatedParams.locale;
      } else {
        updatedParams.locale = newLocale;
      }

      return updatedParams;
    };
  };

  return (
    <div className="language-switcher">
      <Link
        to="/{-$locale}/blog/{-$category}/$slug"
        params={handleLanguageChange("fr")}
      >
        Français
      </Link>

      <Link
        to="/{-$locale}/blog/{-$category}/$slug"
        params={handleLanguageChange("es")}
      >
        Español
      </Link>

      <Link
        to="/{-$locale}/blog/{-$category}/$slug"
        params={handleLanguageChange("en")}
      >
        English
      </Link>
    </div>
  );
}
```

### i18n Avançado com Parâmetros Opcionais

Organize routes de i18n usando parâmetros opcionais para tratamento flexível de locale:

```tsx
// Route structure:
// routes/
//   {-$locale}/
//     index.tsx        // /, /en, /fr
//     about.tsx        // /about, /en/about, /fr/about
//     blog/
//       index.tsx      // /blog, /en/blog, /fr/blog
//       $slug.tsx      // /blog/post, /en/blog/post, /fr/blog/post

// routes/{-$locale}/index.tsx
export const Route = createFileRoute("/{-$locale}/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { locale } = Route.useParams();
  const isRTL = ["ar", "he", "fa"].includes(locale || "");

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <h1>Welcome ({locale || "en"})</h1>
      {/* Localized content */}
    </div>
  );
}

// routes/{-$locale}/about.tsx
export const Route = createFileRoute("/{-$locale}/about")({
  component: AboutComponent,
});
```

### SEO e URLs Canônicas

Trate o SEO para routes de i18n corretamente:

```tsx
export const Route = createFileRoute("/{-$locale}/products/$id")({
  component: ProductComponent,
  head: ({ params, loaderData }) => {
    const locale = params.locale || "en";
    const product = loaderData;

    return {
      title: product.title[locale] || product.title.en,
      meta: [
        {
          name: "description",
          content: product.description[locale] || product.description.en,
        },
        {
          property: "og:locale",
          content: locale,
        },
      ],
      links: [
        // Canonical URL (always use default locale format)
        {
          rel: "canonical",
          href: `https://example.com/products/${params.id}`,
        },
        // Alternate language versions
        {
          rel: "alternate",
          hreflang: "en",
          href: `https://example.com/products/${params.id}`,
        },
        {
          rel: "alternate",
          hreflang: "fr",
          href: `https://example.com/fr/products/${params.id}`,
        },
        {
          rel: "alternate",
          hreflang: "es",
          href: `https://example.com/es/products/${params.id}`,
        },
      ],
    };
  },
});
```

### Type Safety para i18n

Garanta type safety para suas implementações de i18n:

```tsx
// Define supported locales
type Locale = "en" | "fr" | "es" | "de";

// Type-safe locale validation
function validateLocale(locale: string | undefined): locale is Locale {
  return ["en", "fr", "es", "de"].includes(locale as Locale);
}

export const Route = createFileRoute("/{-$locale}/shop/{-$category}")({
  beforeLoad: async ({ params }) => {
    const { locale } = params;

    // Type-safe locale validation
    if (locale && !validateLocale(locale)) {
      throw redirect({
        to: "/shop/{-$category}",
        params: { category: params.category },
      });
    }

    return {
      locale: (locale as Locale) || "en",
      isDefaultLocale: !locale || locale === "en",
    };
  },
  component: ShopComponent,
});

function ShopComponent() {
  const { locale, category } = Route.useParams();
  const { isDefaultLocale } = Route.useRouteContext();

  // TypeScript knows locale is Locale | undefined
  // and we have validated it in beforeLoad

  return (
    <div>
      <h1>Shop {category ? `- ${category}` : ""}</h1>
      <p>Language: {locale || "en"}</p>
      {!isDefaultLocale && (
        <Link to="/shop/{-$category}" params={{ category }}>
          View in English
        </Link>
      )}
    </div>
  );
}
```

Parâmetros de caminho opcionais fornecem uma base poderosa e flexível para implementar internacionalização nas suas aplicações TanStack Router. Seja preferindo abordagens baseadas em prefixo ou combinadas, você pode criar URLs limpos e amigáveis para SEO enquanto mantém uma excelente experiência de desenvolvedor e type safety.

## Caracteres Permitidos

Por padrão, path params são escapados com `encodeURIComponent`. Se você quiser permitir outros caracteres URI válidos (por exemplo, `@` ou `+`), você pode especificar isso nas suas [RouterOptions](../api/router/RouterOptionsType.md#pathparamsallowedcharacters-property).

Exemplo de uso:

```tsx
const router = createRouter({
  // ...
  pathParamsAllowedCharacters: ["@"],
});
```

A seguir está a lista de caracteres permitidos aceitos:

- `;`
- `:`
- `@`
- `&`
- `=`
- `+`
- `$`
- `,`
