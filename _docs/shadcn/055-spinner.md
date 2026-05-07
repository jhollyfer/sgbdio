---
title: Spinner
description: Um indicador que pode ser usado para mostrar um estado de carregamento.
base: radix
component: true
---

```tsx
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-sm tabular-nums">$100.00</span>
        </ItemContent>
      </Item>
    </div>
  );
}
```

## Instalação

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Comando</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add spinner
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Copie e cole o código a seguir no seu projeto.</Step>

<ComponentSource
  name="spinner"
  title="components/ui/spinner.tsx"
  styleName="radix-nova"
/>

<Step>Atualize os caminhos de importação para corresponder à configuração do seu projeto.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Uso

```tsx
import { Spinner } from "@/components/ui/spinner";
```

```tsx
<Spinner />
```

## Customização

Você pode substituir o ícone padrão do spinner por qualquer outro ícone editando o component `Spinner`.

```tsx
import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export function SpinnerCustom() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
    </div>
  );
}
```

```tsx showLineNumbers title="components/ui/spinner.tsx"
import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
```

## Exemplos

### Tamanho

Use a classe utilitária `size-*` para alterar o tamanho do spinner.

```tsx
import { Spinner } from "@/components/ui/spinner";

export function SpinnerSize() {
  return (
    <div className="flex items-center gap-6">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  );
}
```

### Botão

Adicione um spinner a um botão para indicar um estado de carregamento. Lembre-se de usar a prop `data-icon="inline-start"` para adicionar o spinner no início do botão e a prop `data-icon="inline-end"` para adicionar o spinner no final do botão.

```tsx
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm">
        <Spinner data-icon="inline-start" />
        Loading...
      </Button>
      <Button variant="outline" disabled size="sm">
        <Spinner data-icon="inline-start" />
        Please wait
      </Button>
      <Button variant="secondary" disabled size="sm">
        <Spinner data-icon="inline-start" />
        Processing
      </Button>
    </div>
  );
}
```

### Badge

Adicione um spinner a um badge para indicar um estado de carregamento. Lembre-se de usar a prop `data-icon="inline-start"` para adicionar o spinner no início do badge e a prop `data-icon="inline-end"` para adicionar o spinner no final do badge.

```tsx
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerBadge() {
  return (
    <div className="flex items-center gap-4 [--radius:1.2rem]">
      <Badge>
        <Spinner data-icon="inline-start" />
        Syncing
      </Badge>
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" />
        Updating
      </Badge>
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Processing
      </Badge>
    </div>
  );
}
```

### Input Group

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { ArrowUpIcon } from "lucide-react";

export function SpinnerInputGroup() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Send a message..." disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Send a message..." disabled />
        <InputGroupAddon align="block-end">
          <Spinner /> Validating...
          <InputGroupButton className="ml-auto" variant="default">
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### Empty

```tsx
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerEmpty() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Processing your request</EmptyTitle>
        <EmptyDescription>
          Please wait while we process your request. Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      </EmptyContent>
    </Empty>
  );
}
```

## RTL

Para habilitar o suporte a RTL no shadcn/ui, consulte o [guia de configuração RTL](/docs/rtl).

```tsx
"use client";

import * as React from "react";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/examples/radix/ui-rtl/item";
import { Spinner } from "@/examples/radix/ui-rtl/spinner";

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector";

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Processing payment...",
      amount: "$100.00",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "جاري معالجة الدفع...",
      amount: "١٠٠.٠٠ دولار",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "מעבד תשלום...",
      amount: "$100.00",
    },
  },
};

export function SpinnerRtl() {
  const { dir, t } = useTranslation(translations, "ar");

  return (
    <div
      className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]"
      dir={dir}
    >
      <Item variant="muted" dir={dir}>
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{t.title}</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-sm tabular-nums">{t.amount}</span>
        </ItemContent>
      </Item>
    </div>
  );
}
```
