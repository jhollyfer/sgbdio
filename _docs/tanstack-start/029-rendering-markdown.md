---
id: rendering-markdown
title: Rendering Markdown
---

Este guia cobre dois métodos para importar e renderizar conteúdo markdown na sua aplicação TanStack Start:

1. **Markdown estático** com `content-collections` para carregamento em tempo de build (ex.: posts de blog)
2. **Markdown dinâmico** buscado em tempo de execução do GitHub ou qualquer fonte remota

Ambos os métodos compartilham um pipeline de renderização comum usando o ecossistema `unified`.

## Configurando o Processador de Markdown

Ambas as abordagens usam o mesmo pipeline de processamento de markdown para HTML. Primeiro, instale as dependências necessárias:

```bash
npm install unified remark-parse remark-gfm remark-rehype rehype-raw rehype-slug rehype-autolink-headings rehype-stringify shiki html-react-parser gray-matter
```

Crie um utilitário processador de markdown:

```tsx
// src/utils/markdown.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

export type MarkdownHeading = {
  id: string;
  text: string;
  level: number;
};

export type MarkdownResult = {
  markup: string;
  headings: Array<MarkdownHeading>;
};

export async function renderMarkdown(content: string): Promise<MarkdownResult> {
  const headings: Array<MarkdownHeading> = [];

  const result = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // Support GitHub Flavored Markdown
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML AST
    .use(rehypeRaw) // Process raw HTML in markdown
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["anchor"] },
    })
    .use(() => (tree) => {
      // Extract headings for table of contents
      const { visit } = require("unist-util-visit");
      const { toString } = require("hast-util-to-string");

      visit(tree, "element", (node: any) => {
        if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)) {
          headings.push({
            id: node.properties?.id || "",
            text: toString(node),
            level: parseInt(node.tagName.charAt(1), 10),
          });
        }
      });
    })
    .use(rehypeStringify) // Serialize to HTML string
    .process(content);

  return {
    markup: String(result),
    headings,
  };
}
```

## Criando um Componente Markdown

Crie um component React que renderiza o HTML processado com tratamento personalizado de elementos:

```tsx
// src/components/Markdown.tsx
import parse, { type HTMLReactParserOptions, Element } from "html-react-parser";
import { renderMarkdown, type MarkdownResult } from "~/utils/markdown";

type MarkdownProps = {
  content: string;
  className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null);

  useEffect(() => {
    renderMarkdown(content).then(setResult);
  }, [content]);

  if (!result) {
    return <div className={className}>Loading...</div>;
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        // Customize rendering of specific elements
        if (domNode.name === "a") {
          // Handle links
          const href = domNode.attribs.href;
          if (href?.startsWith("/")) {
            // Internal link - use your router's Link component
            return (
              <Link to={href}>{domToReact(domNode.children, options)}</Link>
            );
          }
        }

        if (domNode.name === "img") {
          // Add lazy loading to images
          return (
            <img
              {...domNode.attribs}
              loading="lazy"
              className="rounded-lg shadow-md"
            />
          );
        }
      }
    },
  };

  return <div className={className}>{parse(result.markup, options)}</div>;
}
```

## Método 1: Markdown Estático com content-collections

O pacote `content-collections` é ideal para conteúdo estático como posts de blog que estão incluídos no seu repositório. Ele processa arquivos markdown em tempo de build e fornece acesso type-safe ao conteúdo.

### Instalação

```bash
npm install @content-collections/core @content-collections/vite
```

### Configuração

Crie um arquivo `content-collections.ts` na raiz do seu projeto:

```tsx
// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import matter from "gray-matter";

function extractFrontMatter(content: string) {
  const { data, content: body, excerpt } = matter(content, { excerpt: true });
  return { data, body, excerpt: excerpt || "" };
}

const posts = defineCollection({
  name: "posts",
  directory: "./src/blog", // Directory containing your .md files
  include: "*.md",
  schema: (z) => ({
    title: z.string(),
    published: z.string().date(),
    description: z.string().optional(),
    authors: z.string().array(),
  }),
  transform: ({ content, ...post }) => {
    const frontMatter = extractFrontMatter(content);

    // Extract header image (first image in the document)
    const headerImageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    const headerImage = headerImageMatch ? headerImageMatch[2] : undefined;

    return {
      ...post,
      slug: post._meta.path,
      excerpt: frontMatter.excerpt,
      description: frontMatter.data.description,
      headerImage,
      content: frontMatter.body,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
```

### Integração com Vite

Adicione o plugin content-collections à sua configuração do Vite:

```tsx
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import contentCollections from "@content-collections/vite";

export default defineConfig({
  vite: {
    plugins: [contentCollections()],
  },
});
```

### Criando Posts de Blog

Crie arquivos markdown no diretório designado:

````markdown
## <!-- src/blog/hello-world.md -->

title: Hello World
published: 2024-01-15
authors:

- Jane Doe
  description: My first blog post

---

![Hero Image](/images/hero.jpg)

Welcome to my blog! This is my first post.

## Getting Started

Here's some content with **bold** and _italic_ text.

```javascript
console.log("Hello, world!");
```
````

### Usando a Collection

Acesse seus posts através da collection gerada:

```tsx
// src/routes/blog.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
});

function BlogIndex() {
  // Posts are sorted by published date
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {sortedPosts.map((post) => (
          <li key={post.slug}>
            <Link to="/blog/$slug" params={{ slug: post.slug }}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span>{post.published}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Renderizando um Post Individual

```tsx
// src/routes/blog.$slug.tsx
import { createFileRoute, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { Markdown } from "~/components/Markdown";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    return post;
  },
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <p>
          By {post.authors.join(", ")} on {post.published}
        </p>
      </header>
      <Markdown content={post.content} className="prose" />
    </article>
  );
}
```

## Método 2: Markdown Dinâmico de Fontes Remotas

Para conteúdo armazenado externamente (como repositórios do GitHub), você pode buscar e renderizar markdown dinamicamente usando server functions.

### Criando um Utilitário de Fetch

```tsx
// src/utils/docs.server.ts
import { createServerFn } from "@tanstack/react-start";
import matter from "gray-matter";

type FetchDocsParams = {
  repo: string; // e.g., 'tanstack/router'
  branch: string; // e.g., 'main'
  filePath: string; // e.g., 'docs/guide/getting-started.md'
};

export const fetchDocs = createServerFn({ method: "GET" })
  .inputValidator((params: FetchDocsParams) => params)
  .handler(async ({ data: { repo, branch, filePath } }) => {
    const url = `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;

    const response = await fetch(url, {
      headers: {
        // Add GitHub token for private repos or higher rate limits
        // Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const rawContent = await response.text();
    const { data: frontmatter, content } = matter(rawContent);

    return {
      frontmatter,
      content,
      filePath,
    };
  });
```

### Adicionando Headers de Cache

Para produção, adicione headers de cache apropriados:

```tsx
export const fetchDocs = createServerFn({ method: "GET" })
  .inputValidator((params: FetchDocsParams) => params)
  .handler(async ({ data: { repo, branch, filePath }, context }) => {
    // Set cache headers for CDN caching
    context.response.headers.set(
      "Cache-Control",
      "public, max-age=0, must-revalidate",
    );
    context.response.headers.set(
      "CDN-Cache-Control",
      "max-age=300, stale-while-revalidate=300",
    );

    // ... fetch logic
  });
```

### Usando Markdown Dinâmico em Routes

```tsx
// src/routes/docs.$path.tsx
import { createFileRoute } from "@tanstack/react-router";
import { fetchDocs } from "~/utils/docs.server";
import { Markdown } from "~/components/Markdown";

export const Route = createFileRoute("/docs/$path")({
  loader: async ({ params }) => {
    return fetchDocs({
      data: {
        repo: "your-org/your-repo",
        branch: "main",
        filePath: `docs/${params.path}.md`,
      },
    });
  },
  component: DocsPage,
});

function DocsPage() {
  const { frontmatter, content } = Route.useLoaderData();

  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <Markdown content={content} className="prose" />
    </article>
  );
}
```

### Buscando Conteúdo de Diretórios

Para construir a navegação a partir de um diretório do GitHub:

```tsx
// src/utils/docs.server.ts
type GitHubContent = {
  name: string;
  path: string;
  type: "file" | "dir";
};

export const fetchRepoContents = createServerFn({ method: "GET" })
  .inputValidator(
    (params: { repo: string; branch: string; path: string }) => params,
  )
  .handler(async ({ data: { repo, branch, path } }) => {
    const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contents: ${response.status}`);
    }

    const contents: Array<GitHubContent> = await response.json();

    return contents
      .filter((item) => item.type === "file" && item.name.endsWith(".md"))
      .map((item) => ({
        name: item.name.replace(".md", ""),
        path: item.path,
      }));
  });
```

## Adicionando Destaque de Sintaxe com Shiki

Para blocos de código com destaque de sintaxe, integre o Shiki ao seu processador de markdown:

```tsx
// src/utils/markdown.ts
import { codeToHtml } from "shiki";

// Process code blocks after parsing
export async function highlightCode(
  code: string,
  language: string,
): Promise<string> {
  return codeToHtml(code, {
    lang: language,
    themes: {
      light: "github-light",
      dark: "tokyo-night",
    },
  });
}
```

Depois trate os blocos de código no seu component Markdown:

```tsx
// In your Markdown component's replace function
if (domNode.name === "pre") {
  const codeElement = domNode.children.find(
    (child) => child instanceof Element && child.name === "code",
  );
  if (codeElement) {
    const className = codeElement.attribs.class || "";
    const language = className.replace("language-", "") || "text";
    const code = getText(codeElement);

    return <CodeBlock code={code} language={language} />;
  }
}
```

## Resumo

| Abordagem           | Melhor Para                                       | Prós                                                       | Contras                                           |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------- |
| content-collections | Posts de blog, docs estáticos incluídos no app     | Type-safe, processamento em tempo de build, runtime rápido | Requer rebuild para atualizações de conteúdo      |
| Fetch dinâmico      | Docs externos, conteúdo atualizado frequentemente  | Sempre atualizado, sem necessidade de rebuild              | Overhead de runtime, requer tratamento de erros   |

Escolha a abordagem que melhor se adapta à frequência de atualização do seu conteúdo e ao seu fluxo de deploy. Para cenários híbridos, você pode usar ambos os métodos na mesma aplicação.
