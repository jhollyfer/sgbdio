---
title: Breadcrumb
description: Exibe o caminho ate o recurso atual usando uma hierarquia de links.
base: radix
component: true
---

```tsx
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost">
                <BreadcrumbEllipsis />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Themes</DropdownMenuItem>
                <DropdownMenuItem>GitHub</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Components</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

## Instalacao

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add breadcrumb
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copie e cole o codigo a seguir no seu projeto.</Step>

<ComponentSource name="breadcrumb" title="components/ui/breadcrumb.tsx" />

<Step>Atualize os caminhos de importacao para corresponder a configuracao do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx showLineNumbers
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
```

```tsx showLineNumbers
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Exemplos

### Basico

Um breadcrumb basico com um link para a pagina inicial e um link para components.

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbBasic() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

### Separador personalizado

Use um component personalizado como `children` para `<BreadcrumbSeparator />` para criar um separador customizado.

```tsx
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DotIcon } from "lucide-react";

export function BreadcrumbSeparatorDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/components">Components</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

### Dropdown

Voce pode compor `<BreadcrumbItem />` com um `<DropdownMenu />` para criar um dropdown no breadcrumb.

```tsx
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, DotIcon } from "lucide-react";

export function BreadcrumbDropdown() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1">
                Components
                <ChevronDownIcon className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Themes</DropdownMenuItem>
                <DropdownMenuItem>GitHub</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

### Recolhido

Fornecemos um component `<BreadcrumbEllipsis />` para exibir um estado recolhido quando o breadcrumb e muito longo.

```tsx
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbEllipsisDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs/components">Components</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

### Component de link

Para usar um component de link personalizado da sua biblioteca de roteamento, voce pode usar a prop `asChild` no `<BreadcrumbLink />`.

```tsx
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbLinkDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/components">Components</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

## RTL

Para habilitar o suporte RTL no shadcn/ui, consulte o [guia de configuracao RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/examples/radix/ui-rtl/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/examples/radix/ui-rtl/dropdown-menu";
import { ChevronDownIcon, DotIcon } from "lucide-react";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      home: "Home",
      components: "Components",
      documentation: "Documentation",
      themes: "Themes",
      github: "GitHub",
      breadcrumb: "Breadcrumb",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      home: "الرئيسية",
      components: "المكونات",
      documentation: "التوثيق",
      themes: "السمات",
      github: "جيت هاب",
      breadcrumb: "مسار التنقل",
    },
  },
  he: {
    dir: "rtl",
    values: {
      home: "בית",
      components: "רכיבים",
      documentation: "תיעוד",
      themes: "ערכות נושא",
      github: "גיטהאב",
      breadcrumb: "פירורי לחם",
    },
  },
};

export function BreadcrumbRtl() {
  const { dir, t, language } = useTranslation(translations, "ar");

  return (
    <Breadcrumb dir={dir}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">{t.home}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1">
                {t.components}
                <ChevronDownIcon className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-lang={dir === "rtl" ? language : undefined}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem>{t.documentation}</DropdownMenuItem>
                <DropdownMenuItem>{t.themes}</DropdownMenuItem>
                <DropdownMenuItem>{t.github}</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{t.breadcrumb}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

## Referencia da API

### Breadcrumb

O component `Breadcrumb` e o elemento de navegacao raiz que envolve todos os components do breadcrumb.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbList

O component `BreadcrumbList` exibe a lista ordenada de itens do breadcrumb.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbItem

O component `BreadcrumbItem` envolve itens individuais do breadcrumb.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbLink

O component `BreadcrumbLink` exibe um link clicavel no breadcrumb.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbPage

O component `BreadcrumbPage` exibe a pagina atual no breadcrumb (nao clicavel).

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |

### BreadcrumbSeparator

O component `BreadcrumbSeparator` exibe um separador entre os itens do breadcrumb. Voce pode passar children personalizados para substituir o icone separador padrao.

| Prop        | Type              | Default |
| ----------- | ----------------- | ------- |
| `children`  | `React.ReactNode` | -       |
| `className` | `string`          | -       |

### BreadcrumbEllipsis

O component `BreadcrumbEllipsis` exibe um indicador de reticencias para itens recolhidos do breadcrumb.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| `className` | `string` | -       |
