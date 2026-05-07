---
title: Document Head Management
---

O gerenciamento do head do documento é o processo de gerenciar as tags head, title, meta, link e script de um documento, e o TanStack Router fornece uma forma robusta de gerenciar o head do documento tanto para aplicações full-stack que usam Start quanto para aplicações de página única que usam `@tanstack/react-router`. Ele oferece:

- Deduplicação automática de tags `title` e `meta`
- Carregamento/descarregamento automático de tags baseado na visibilidade da route
- Uma forma composável de mesclar tags `title` e `meta` de routes aninhadas

Para aplicações full-stack que usam Start, e até para aplicações de página única que usam `@tanstack/react-router`, gerenciar o head do documento é uma parte crucial de qualquer aplicação pelos seguintes motivos:

- SEO
- Compartilhamento em redes sociais
- Analytics
- Carregamento/descarregamento de CSS e JS

Para gerenciar o head do documento, é necessário que você renderize tanto o component `<HeadContent />` quanto o component `<Scripts />` e use a propriedade `routeOptions.head` para gerenciar o head de uma route, que retorna um objeto com as propriedades `title`, `meta`, `links`, `styles` e `scripts`.

## Gerenciando o Head do Documento

```tsx
export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        name: "description",
        content: "My App is a web application",
      },
      {
        title: "My App",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
    styles: [
      {
        media: "all and (max-width: 500px)",
        children: `p {
                color: blue;
                background-color: yellow;
              }`,
      },
    ],
    scripts: [
      {
        src: "https://www.google-analytics.com/analytics.js",
      },
    ],
  }),
});
```

### Deduplicação

Por padrão, o TanStack Router deduplica tags `title` e `meta`, preferindo a **última** ocorrência de cada tag encontrada em routes aninhadas.

- Tags `title` definidas em routes aninhadas sobrescrevem uma tag `title` definida em uma route pai (mas você pode compô-las juntas, o que é abordado em uma seção futura deste guia)
- Tags `meta` com o mesmo `name` ou `property` serão sobrescritas pela última ocorrência dessa tag encontrada em routes aninhadas

### `<HeadContent />`

O component `<HeadContent />` é **obrigatório** para renderizar as tags head, title, meta, link e script relacionadas ao head de um documento.

Ele deve ser **renderizado dentro da tag `<head>` do seu layout raiz ou o mais alto possível na árvore de components** se sua aplicação não gerencia ou não pode gerenciar a tag `<head>`.

### Aplicações Start/Full-Stack

```tsx
import { HeadContent } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  ),
});
```

### Aplicações de Página Única

Primeiro, remova a tag `<title>` do index.html se você tiver definido alguma.

```tsx
import { HeadContent } from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
    </>
  ),
});
```

## Gerenciando Scripts do Body

Além de scripts que podem ser renderizados na tag `<head>`, você também pode renderizar scripts na tag `<body>` usando a propriedade `routeOptions.scripts`. Isso é útil para carregar scripts (inclusive scripts inline) que requerem que o DOM esteja carregado, mas antes do ponto de entrada principal da sua aplicação (que inclui hydration se você estiver usando Start ou uma implementação full-stack do TanStack Router).

Para fazer isso, você deve:

- Usar a propriedade `scripts` do objeto `routeOptions`
- [Renderizar o component `<Scripts />`](#scripts)

```tsx
export const Route = createRootRoute({
  scripts: () => [
    {
      children: 'console.log("Hello, world!")',
    },
  ],
});
```

### `<Scripts />`

O component `<Scripts />` é **obrigatório** para renderizar os scripts do body de um documento. Ele deve ser renderizado dentro da tag `<body>` do seu layout raiz ou o mais alto possível na árvore de components se sua aplicação não gerencia ou não pode gerenciar a tag `<body>`.

### Exemplo

```tsx
import { createFileRoute, Scripts } from "@tanstack/react-router";
export const Router = createFileRoute("/")({
  component: () => (
    <html>
      <head />
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});
```

```tsx
import { Scripts, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Scripts />
    </>
  ),
});
```

## Scripts Inline com ScriptOnce

Para scripts que devem ser executados antes do React fazer hydration (como detecção de tema), use `ScriptOnce`. Isso é particularmente útil para evitar flash de conteúdo sem estilo (FOUC) ou oscilação de tema.

```tsx
import { ScriptOnce } from "@tanstack/react-router";

const themeScript = `(function() {
  try {
    const theme = localStorage.getItem('theme') || 'auto';
    const resolved = theme === 'auto'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.classList.add(resolved);
  } catch (e) {}
})();`;

function ThemeProvider({ children }) {
  return (
    <>
      <ScriptOnce children={themeScript} />
      {children}
    </>
  );
}
```

### Como o ScriptOnce Funciona

1. Durante o SSR, renderiza uma tag `<script>` com o código fornecido
2. O script é executado imediatamente quando o navegador analisa o HTML (antes do React fazer hydration)
3. Após a execução, o script se remove do DOM
4. Na navegação do lado do cliente, nada é renderizado (previne execução duplicada)

### Prevenindo Avisos de Hydration

Se o seu script modifica o DOM antes da hydration (como adicionar uma classe ao `<html>`), use `suppressHydrationWarning` para prevenir avisos do React:

```tsx
export const Route = createRootRoute({
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  ),
});
```

### Casos de Uso Comuns

- **Detecção de tema/modo escuro** - Aplicar classe de tema antes da hydration para prevenir flash
- **Detecção de funcionalidades** - Verificar capacidades do navegador antes de renderizar
- **Inicialização de analytics** - Inicializar rastreamento antes da interação do usuário
- **Configuração de caminho crítico** - Qualquer JavaScript que precisa executar antes da hydration
